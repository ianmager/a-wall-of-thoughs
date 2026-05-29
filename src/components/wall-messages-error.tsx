type WallMessagesErrorProps = {
  message: string;
};

export function WallMessagesError({ message }: WallMessagesErrorProps) {
  return (
    <p
      className="rounded-sm border-2 border-red-800/35 bg-red-100/90 px-3 py-2 text-sm font-medium text-red-950"
      role="alert"
    >
      Could not load messages ({message}). If you just cloned the repo, run the SQL migration in
      Supabase.
    </p>
  );
}
