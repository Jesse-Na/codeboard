"use server";

import { auth } from "@/lib/auth";

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    const data = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    console.log("Sign-up response:", data);

    return {
      success: true,
      message: "Sign-up successful!",
    };
  } catch (error) {
    console.error("Sign-up error:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Sign-up failed",
    };
  }
}
