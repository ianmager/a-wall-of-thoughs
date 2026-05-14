import { GoogleAuthButtons } from "@/components/google-auth-buttons";
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

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">a-wall-of-thoughts</h1>
      <p className="text-sm text-foreground/80">
        Next.js + TypeScript + Tailwind. The public message wall will live here.
      </p>

      {sp.error === "auth" ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Something went wrong signing you in. Try again, and confirm Supabase redirect URLs
          include this app&apos;s <code className="font-mono text-xs">/auth/callback</code> URL.
        </p>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-foreground/10 pt-4">
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
    </main>
  );
}
