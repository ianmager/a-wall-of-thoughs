-- User-chosen tag size and bounding-box width.
-- Both nullable: legacy rows keep using the hash-based fallback.

alter table public.messages
  add column if not exists font_size smallint,
  add column if not exists max_width_rem smallint;

alter table public.messages
  drop constraint if exists messages_font_size_range,
  drop constraint if exists messages_max_width_rem_range;

alter table public.messages
  add constraint messages_font_size_range
    check (font_size is null or (font_size between 1 and 4)),
  add constraint messages_max_width_rem_range
    check (max_width_rem is null or (max_width_rem between 6 and 36));
