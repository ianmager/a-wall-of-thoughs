export type WallMessage = {
  id: string;
  body: string;
  created_at: string;
  pos_x: number | null;
  pos_y: number | null;
  rotate_deg: number | null;
  color_key: string | null;
  font_size: number | null;
  max_width_rem: number | null;
};

export const WALL_MESSAGE_COLUMNS =
  "id, body, created_at, pos_x, pos_y, rotate_deg, color_key, font_size, max_width_rem";

/** Mirrors the `messages_body_length` CHECK constraint in the DB migration. */
export const MAX_BODY_LENGTH = 500;
