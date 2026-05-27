-- Widen `rotate_deg` range so users can fully rotate a tag.
-- Original range was [-45, 45]; new range allows a full circle.

alter table public.messages
  drop constraint if exists messages_rotate_deg_range;

alter table public.messages
  add constraint messages_rotate_deg_range
    check (rotate_deg is null or (rotate_deg >= -180 and rotate_deg <= 180));
