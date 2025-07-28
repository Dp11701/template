import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl } from "@/lib/env";

const API_BASE_URL = getApiUrl();

export interface LandingPageConfig {
  _id: string;
  brand: string;
  desc: string;
  trackingLink?: string;
  imageUrl?: string;
  brandColor: string;
  descColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLandingPageData {
  brand: string;
  desc: string;
  trackingLink?: string;
  imageKey?: string;
  brandColor?: string;
  descColor?: string;
}

// Query key factory
export const landingPageKeys = {
  all: ["landing-config"] as const,
  latest: () => [...landingPageKeys.all, "latest"] as const,
};

// Custom hook for fetching landing page config
export function useLandingPageConfig() {
  return useQuery({
    queryKey: landingPageKeys.latest(),
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/landingpage`);
      return res.data.data as LandingPageConfig;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Custom hook for saving landing page config
export function useSaveLandingPageConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLandingPageData) => {
      const res = await axios.post(`${API_BASE_URL}/landingpage`, data);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: landingPageKeys.all });
    },
  });
}

// Custom hook for uploading images
export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
  });
}
