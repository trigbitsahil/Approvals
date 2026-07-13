import { request } from "@/api/core/request";
import { AppServerService } from "@/api/services/AppServerService";
import { storeTokens, getRefreshToken } from "@/utils/authToken";
import { OpenAPI } from "@/api/core/OpenAPI";
import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";

export async function requestWithAutoRefresh<T>(options: Parameters<typeof __request>[1]): Promise<T> {
  try {
    return await request(OpenAPI, options);
  } catch (error: any) {
    if (error?.status === 401) {
      // Access token expired, call refresh
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw error;

      const refreshResponse = await AppServerService.postApiVIdentityRefresh({ refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = refreshResponse;

      // Store new tokens
      storeTokens(accessToken ?? "", newRefreshToken ?? "");
      OpenAPI.TOKEN = accessToken ?? "";
      CustomOpenAPIConfig.TOKEN = accessToken ?? "";

      // Retry original request
      return request(OpenAPI, options);
    }
    throw error;
  }
}
