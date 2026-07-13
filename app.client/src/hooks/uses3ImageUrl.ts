import { useCallback } from "react";

import { clientConfig } from "@/config/client";
import processS3Path from "@/helpers/s3Image";

const { s3Proxy } = clientConfig;
const useS3ImageUrl = (imageProxyUrl?: string) => {
  const getS3Url = useCallback(
    (imageUrl: string, folder?: string) => {
      if (!imageUrl) {
        return imageUrl;
      }
      return processS3Path(imageUrl, imageProxyUrl || s3Proxy, folder);
    },
    [imageProxyUrl]
  );
  return { getS3Url, s3Proxy };
};

export default useS3ImageUrl;
