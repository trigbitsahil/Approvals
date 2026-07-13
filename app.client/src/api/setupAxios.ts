import axios from "axios";
import { AppServerService } from "@/api/services/AppServerService";
import { storeTokens, getRefreshToken } from "@/utils/authToken";

// Flag to prevent infinite loops
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const setupAxios = () => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // Check if error is 401 and we haven't retried yet
            // Also ensure we are not already trying to refresh (to prevent loop for the refresh call itself)
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                // Prevent intercepting the refresh token call itself if it fails
                !originalRequest.url?.includes("/identity/refresh")
            ) {
                if (isRefreshing) {
                    // If already refreshing, queue this request
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            return axios(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    isRefreshing = false;
                    return Promise.reject(error);
                }

                try {
                    // Call the refresh token endpoint
                    // Note: ensure this call doesn't use the same interceptor instance or is handled correctly
                    // Since we checked url !includes refresh above, it should be fine.
                    const response = await AppServerService.postApiVIdentityRefresh({
                        refreshToken: refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response;

                    if (accessToken && newRefreshToken) {
                        storeTokens(accessToken, newRefreshToken);

                        // OpenAPI token will be picked up automatically via the async function in App.tsx
                        // But for the retry we need to set header manually
                        axios.defaults.headers.common["Authorization"] =
                            "Bearer " + accessToken;
                        originalRequest.headers["Authorization"] = "Bearer " + accessToken;

                        processQueue(null, accessToken);
                        isRefreshing = false;

                        return axios(originalRequest);
                    } else {
                        throw new Error("Invalid response from refresh token API");
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    // Optionally clear tokens or redirect to login
                    // clearTokens();
                    // window.location.href = '/signin';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};
