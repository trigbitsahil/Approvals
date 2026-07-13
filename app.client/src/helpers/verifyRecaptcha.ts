

import axios, { AxiosResponse } from "axios";

export const verifyReCAPTCHA = async (userResponse: string): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(
      "/api/recaptcha/siteverify",
      {
        response: userResponse,
      }
    );

    if (response.data.success) {
      // reCAPTCHA verification succeeded
      return { success: true };
    } else {
      // reCAPTCHA verification failed
      return { success: false };
    }
  } catch (error) {
    // Handle request error
    console.error(error);
    return { success: false, error: "An error occurred" };
  }
};
