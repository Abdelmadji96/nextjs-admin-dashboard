/**
 * Diploma Service
 * API functions for diploma verification operations
 */

import apiClient from "@/lib/api";
import type {
  DiplomasResponse,
  DiplomasQueryParams,
  DiplomaTypesResponse,
  DiplomaLevelsResponse,
} from "@/types/diploma";

export const getDiplomas = async (
  params?: DiplomasQueryParams,
): Promise<DiplomasResponse> => {
  const response = await apiClient.get<DiplomasResponse>("/diplomas", {
    params,
  });
  return response.data;
};

export const getDiplomaTypes =
  async (): Promise<DiplomaTypesResponse> => {
    const response = await apiClient.get<DiplomaTypesResponse>(
      "/datasets/diploma-types",
    );
    return response.data;
  };

export const getDiplomaLevels = async (
  diplomaTypeId?: number,
): Promise<DiplomaLevelsResponse> => {
  const response = await apiClient.get<DiplomaLevelsResponse>(
    "/datasets/diploma-levels",
    {
      params: diplomaTypeId ? { diploma_type_id: diplomaTypeId } : undefined,
    },
  );
  return response.data;
};

export const approveDiploma = async (diplomaId: number): Promise<any> => {
  const response = await apiClient.patch(`/diplomas/${diplomaId}/approve`);
  return response.data;
};


export const rejectDiploma = async (diplomaId: number): Promise<any> => {
  const response = await apiClient.patch(`/diplomas/${diplomaId}/reject`);
  return response.data;
};

// Re-export types for convenience
export type {
  Diploma,
  DiplomasQueryParams,
  DiplomaType,
  DiplomaLevel,
} from "@/types/diploma";

