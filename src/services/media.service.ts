import { apiService } from "./api";

export interface UploadMediaResponse {
  url: string;
  publicId: string;
}

export const mediaService = {
  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "seller-logos");

    return apiService.post<UploadMediaResponse>(
      "/v1/seller/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    return apiService.post<UploadMediaResponse>(
      "/v1/seller/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  adminUpload: async (file: File, folder: string = "categories") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return apiService.post<UploadMediaResponse>(
      "/v1/admin/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
