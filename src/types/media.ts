export interface Media {
  id: number;
  file_name: string;
  collection_name: "avatar" | "id_card_back" | "id_card_front" | string;
  model_id: string;
  model_name: string;
  hash: string;
}

export interface MediaResponse {
  statusCode: number;
  message: string;
  data: Media[];
}

export interface CandidateMedias {
  avatar?: Media;
  id_card_front?: Media;
  id_card_back?: Media;
  diplomas?: Media[];
}
