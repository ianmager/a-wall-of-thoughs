import { ComposerSection } from "@/components/composer-section";
import { GraffitiWall } from "@/components/graffiti-wall";
import { SignInWithGoogleButton, SignOutButton } from "@/components/google-auth-buttons";
import { WallFeed } from "@/components/wall-feed";
import { WallMessagesError } from "@/components/wall-messages-error";
import { WallMessagesProvider } from "@/components/wall-messages-provider";
import { isAdminUser } from "@/lib/admin";
import { formatWallTime } from "@/lib/format-wall-time";
import { WALL_MESSAGE_COLUMNS, type WallMessage } from "@/lib/wall-message";
import { createClient } from "@/lib/supabase/server";

type HomeProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const sp = (await searchParams) ?? {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select(WALL_MESSAGE_COLUMNS)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const wallMessages = (messages ?? []) as WallMessage[];
  const canModerate = isAdminUser(user);
  const messagesErrorMessage = messagesError?.message ?? null;

  const wallSection = user ? (
    <WallFeed canDelete={canModerate} messagesError={messagesErrorMessage} />
  ) : (
    <WallSectionStatic
      messages={wallMessages}
      canDelete={canModerate}
      messagesError={messagesErrorMessage}
    />
  );

  const content = (
    <main className="relative z-10 flex min-h-screen flex-col gap-8 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b border-dashed border-stone-900/30 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 flex flex-col gap-3">
            <h1 className="font-display text-4xl lowercase leading-none tracking-wide text-stone-950 drop-shadow-sm sm:text-5xl">
              a-wall-of-thoughts
            </h1>
            <p className="text-sm font-medium text-stone-800/90">
              {user
                ? "Public wall, oldest posts first. Click anywhere on the wall to add a tag."
                : "Public wall, oldest posts first. Sign in to add a message."}
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

        {user ? (
          <ComposerSection />
        ) : (
          <div className="rounded-sm border border-stone-900/20 bg-stone-950/5 p-4 sm:p-5">
            <p className="text-sm text-stone-800/85">Not signed in.</p>
          </div>
        )}
      </header>
      </div>

      <section className="flex w-full flex-col gap-5 pb-20" aria-labelledby="wall-heading">
        <h2
          id="wall-heading"
          className="mx-auto w-full max-w-7xl px-4 font-display text-2xl lowercase tracking-wide text-stone-950 sm:px-8 lg:px-12"
        >
          Wall
        </h2>
        {wallSection}
      </section>
    </main>
  );

  if (user) {
    return (
      <WallMessagesProvider initialMessages={wallMessages}>{content}</WallMessagesProvider>
    );
  }

  return content;
}

type WallSectionStaticProps = {
  messages: WallMessage[];
  canDelete: boolean;
  messagesError: string | null;
};

function WallSectionStatic({ messages, canDelete, messagesError }: WallSectionStaticProps) {
  if (messagesError) {
    return <WallMessagesError message={messagesError} />;
  }

  if (messages.length === 0) {
    return (
      <p className="mx-auto w-full max-w-7xl px-4 font-display text-lg lowercase tracking-wide text-stone-800/75 sm:px-8 lg:px-12">
        No messages yet — hit the wall first.
      </p>
    );
  }

  return (
    <GraffitiWall messages={messages} canDelete={canDelete} formatTime={formatWallTime} />
  );
}
