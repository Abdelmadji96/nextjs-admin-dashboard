import apiClient from "@/lib/api";
import type { MediaResponse, CandidateMedias } from "@/types/media";

export const getCandidateMedias = async (
  reference: string,
): Promise<MediaResponse> => {
  const response = await apiClient.get<MediaResponse>(
    `/candidates/${reference}/medias`,
  );
  return response.data;
};

export const organizeCandidateMedias = (
  medias: MediaResponse["data"],
): CandidateMedias => {
  const organized: CandidateMedias = {};

  medias.forEach((media) => {
    if (media.collection_name === "avatar") {
      organized.avatar = media;
    } else if (media.collection_name === "id_card_front") {
      organized.id_card_front = media;
    } else if (media.collection_name === "id_card_back") {
      organized.id_card_back = media;
    }
  });

  return organized;
};

export const getMediaUrl = (hash: string): string => {
  const baseURL =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "http://localhost:3000/api";
  return `${baseURL}/v1/medias/${hash}`;
};
