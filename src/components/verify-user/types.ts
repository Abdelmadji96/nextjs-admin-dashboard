export type FilterStatus =
  | "all"
  | "no_diploma_submitted"
  | "diploma_verified"
  | "diploma_verif_rejected"
  | "diploma_verif_pending"
  | "story_not_uploaded"
  | "story_published"
  | "story_rejected"
  | "story_pending"
  | "id_confirmed"
  | "id_rejected"
  | "id_pending"
  | "id_not_submitted";

export interface CheckboxFilters {
  no_diploma_submitted: boolean;
  diploma_verified: boolean;
  diploma_verif_rejected: boolean;
  diploma_verif_pending: boolean;
  story_not_uploaded: boolean;
  story_published: boolean;
  story_rejected: boolean;
  story_pending: boolean;
  id_confirmed: boolean;
  id_rejected: boolean;
  id_pending: boolean;
  id_not_submitted: boolean;
}

