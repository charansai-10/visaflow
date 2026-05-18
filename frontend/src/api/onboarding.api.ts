import axios from "./axios";

export const onboardingApi = {

  getStatus: async () => {
    const res = await axios.get("/onboarding/status");
    return res.data;
  },

  verifyEmail: async (body: { otp: string }) => {
    const res = await axios.post("/onboarding/verify-email", body);
    return res.data; // { access_token, refresh_token, roles, onboarding_step }
  },

  resendOtp: async () => {
    const res = await axios.post("/onboarding/resend-otp");
    return res.data; // { message }
  },

  saveProfile: async (body: {
    full_legal_name: string;
    nationality: string;
    visa_targets: string[];
  }) => {
    const res = await axios.post("/onboarding/profile", body);
    return res.data;
  },

  complete: async () => {
    const res = await axios.post("/onboarding/complete");
    return res.data;
  },

};