import { GoogleAuthButtons } from "@/components/google-auth-buttons";
import { PostMessageForm } from "@/components/post-message-form";
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

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2 border-b border-foreground/10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">a-wall-of-thoughts</h1>
        <p className="text-sm text-foreground/80">
          Public wall, oldest posts first. Sign in to add a message.
        </p>
        {sp.error === "auth" ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            Something went wrong signing you in. Try again, and confirm Supabase redirect URLs
            include this app&apos;s <code className="font-mono text-xs">/auth/callback</code> URL.
          </p>
        ) : null}
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            Session
          </p>
          {user ? (
            <p className="text-sm text-foreground/90">
              Signed in as <span className="font-medium">{user.email ?? user.id}</span>
            </p>
          ) : (
            <p className="text-sm text-foreground/80">Not signed in.</p>
          )}
          <GoogleAuthButtons isSignedIn={!!user} />
        </div>
      </header>

      <section className="flex flex-col gap-3" aria-labelledby="wall-heading">
        <h2 id="wall-heading" className="text-sm font-medium text-foreground/90">
          Wall
        </h2>
        {messagesError ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            Could not load messages ({messagesError.message}). If you just cloned the repo, run
            the SQL migration in Supabase.
          </p>
        ) : wallMessages.length === 0 ? (
          <p className="text-sm text-foreground/60">No messages yet. Be the first.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {wallMessages.map((m) => (
              <li
                key={m.id}
                className="rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2 dark:bg-foreground/[0.04]"
              >
                <p className="whitespace-pre-wrap break-words text-sm text-foreground/95">
                  {m.body}
                </p>
                <p className="mt-1 text-xs text-foreground/45">{formatWallTime(m.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {user ? (
        <section className="flex flex-col gap-2 border-t border-foreground/10 pt-6">
          <h2 className="text-sm font-medium text-foreground/90">Add a message</h2>
          <PostMessageForm />
        </section>
      ) : null}
    </main>
  );
}
