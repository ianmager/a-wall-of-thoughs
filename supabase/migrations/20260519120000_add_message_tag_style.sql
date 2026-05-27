-- User-chosen tag placement and style for messages on the wall.
-- Mirrors columns already applied to the live Supabase project. Safe to re-run.
--
-- Style fields are nullable: legacy rows keep using the app's hash-based
-- fallback. New posts populate all four together.

alter table public.messages
  add column if not exists pos_x real,
  add column if not exists pos_y real,
  add column if not exists rotate_deg real,
  add column if not exists color_key text;

-- Range and allow-list checks (idempotent: drop then add).
alter table public.messages
  drop constraint if exists messages_pos_x_range,
  drop constraint if exists messages_pos_y_range,
  drop constraint if exists messages_rotate_deg_range,
  drop constraint if exists messages_color_key_allowed,
  drop constraint if exists messages_style_all_or_none;

alter table public.messages
  add constraint messages_pos_x_range
    check (pos_x is null or (pos_x >= 0 and pos_x <= 100)),
  add constraint messages_pos_y_range
    check (pos_y is null or (pos_y >= 0 and pos_y <= 100)),
  add constraint messages_rotate_deg_range
    check (rotate_deg is null or (rotate_deg >= -45 and rotate_deg <= 45)),
  add constraint messages_color_key_allowed
    check (
      color_key is null
      or color_key in (
        'fuchsia', 'cyan', 'lime', 'amber', 'rose', 'violet',
        'sky', 'orange', 'emerald', 'pink', 'yellow', 'white'
      )
    ),
  add constraint messages_style_all_or_none
    check (
      (pos_x is null and pos_y is null and rotate_deg is null and color_key is null)
      or (
        pos_x is not null
        and pos_y is not null
        and rotate_deg is not null
        and color_key is not null
      )
    );
