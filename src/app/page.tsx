import { SignInWithGoogleButton, SignOutButton } from "@/components/google-auth-buttons";
import { PostMessageForm } from "@/components/post-message-form";
import { WallPostCard } from "@/components/wall-post-card";
import { isAdminUser } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

type HomeProps = {
  searchParams?: Promise<{ error?: string }>;
};

type WallMessage = {
  id: string;
  body: string;
  created_at: string;
};

function formatWallTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = (await searchParams) ?? {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("id, body, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const wallMessages = (messages ?? []) as WallMessage[];
  const canModerate = isAdminUser(user);

  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-8 overflow-x-hidden px-4 py-10 pb-20 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b border-dashed border-stone-900/30 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 flex flex-col gap-3">
            <h1 className="font-display text-4xl lowercase leading-none tracking-wide text-stone-950 drop-shadow-sm sm:text-5xl">
              a-wall-of-thoughts
            </h1>
            <p className="text-sm font-medium text-stone-800/90">
              Public wall, oldest posts first. Sign in to add a message.
            </p>
            {sp.error === "auth" ? (
              <p
                className="rounded-sm border-2 border-red-800/40 bg-red-100/90 px-3 py-2 text-sm font-medium text-red-950"
                role="alert"
              >
                Something went wrong signing you in. Try again, and confirm Supabase redirect URLs
                include this app&apos;s <code className="font-mono text-xs">/auth/callback</code> URL.
              </p>
            ) : null}
          </div>
          <div className="shrink-0 self-end sm:self-start">
            {user ? <SignOutButton /> : <SignInWithGoogleButton />}
          </div>
        </div>

        <div className="rounded-sm border border-stone-900/20 bg-stone-950/5 p-4 sm:p-5">
          {user ? (
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-2xl lowercase tracking-wide text-stone-950">
                Add a tag
              </h2>
              <PostMessageForm />
            </div>
          ) : (
            <p className="text-sm text-stone-800/85">Not signed in.</p>
          )}
        </div>
      </header>

      <section className="flex flex-col gap-5" aria-labelledby="wall-heading">
        <h2
          id="wall-heading"
          className="font-display text-2xl lowercase tracking-wide text-stone-950"
        >
          Wall
        </h2>
        {messagesError ? (
          <p
            className="rounded-sm border-2 border-red-800/35 bg-red-100/90 px-3 py-2 text-sm font-medium text-red-950"
            role="alert"
          >
            Could not load messages ({messagesError.message}). If you just cloned the repo, run
            the SQL migration in Supabase.
          </p>
        ) : wallMessages.length === 0 ? (
          <p className="font-display text-lg lowercase tracking-wide text-stone-800/75">
            No messages yet — hit the wall first.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-10 px-1 py-2 md:grid-cols-2 xl:grid-cols-3">
            {wallMessages.map((m) => (
              <WallPostCard
                key={m.id}
                id={m.id}
                body={m.body}
                createdLabel={formatWallTime(m.created_at)}
                canDelete={canModerate}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
