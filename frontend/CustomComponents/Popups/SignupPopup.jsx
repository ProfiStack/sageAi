"use client";
import { cn, resetGuestMessageCount } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useFormHook } from "react-hook-form";

import { useAmplitude } from "@/app/providers/amplitudeProvider";
import { setAuthToken, setLoginTimestamp } from "@/shared/utils/utils";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFormToast from "../FormToast/FormToast";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z.string().refine(
    (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailPattern.test(value);
    },
    {
      message: "Please enter a valid email address",
    }
  ),

  password: z.string().min(6, {
    message: "Password should contain minimum 6 characters",
  }),
});

export default function SignUpPopup() {
  const { logEvent } = useAmplitude();
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { destructiveToast, primaryToast } = useFormToast();
  async function onSubmit(values) {
    try {
      logEvent("Onboard Option Clicked", {
        click_value: "Sign Up",
        click_location: "Onboarding",
      });
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      const transformedValues = {
        name: values.name,
        ...(isEmail && { email: values.email }),
        password: values.password,
      };
      const data = await Api.client.signIn(transformedValues);
      if (data.token) {
        const token = data.token;
        const decoded = jwtDecode(token);
        await setAuthToken(data.token);
        window.localStorage.setItem("sagee_user_id", data.token);
        await setLoginTimestamp(Date.now());
        localStorage.setItem("token", data.token);
        localStorage.setItem("sagee_user_id", decoded.user_id);
        const store = useAuthStore.getState();
        store.setUserId(decoded.user_id);
        store.setToken(data.token);
        store.setIsAuthenticated(true);
        store.setIsSubscribed(data.subscription);
        resetGuestMessageCount();
        setUserMessageCount(0);
        logEvent("Onboard Sucessful");
        await transferGuestQuizResults(data.token);
        router.push("/home");
        primaryToast({ description: "Login successful" });
        setIsLoading(false);
      } else if (data.detail) {
        setIsLoading(false);
        destructiveToast(data.detail);
      }
    } catch (error) {
      destructiveToast(error.message);
    }
  }
  // Transfer guest quiz results to user profile
  const transferGuestQuizResults = async (token) => {
    try {
      if (typeof window !== "undefined") {
        const guestQuizResults = localStorage.getItem(
          "sagee_guest_quiz_results"
        );

        if (guestQuizResults) {
          const result = JSON.parse(guestQuizResults);

          if (result) {
            await Api.client.updateProfile(result, token);

            // Remove guest quiz results from localStorage
            localStorage.removeItem("sagee_guest_quiz_results");
          }
        }
      }
    } catch (error) {
      console.error("Error transferring guest quiz results:", error);
      // Don't block login if transfer fails
    }
  };

  return (
    <div className="fixed inset-0   flex items-end bottom-[78px] justify-center z-50">
      <div className=" bg-white p-6 w-full">
        <div className="text-center mb-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full"
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="mb-3  rounded-[8px] border-[#02331E66] border w-full text-[#363636] "
                            placeholder="Email or Phone Number (starts with eg +123)"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />{" "}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="mb-3  rounded-[8px] border-[#02331E66] border w-full text-[#363636] "
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />{" "}
                </div>
              </div>

              <Button
                className={cn(
                  "flex justify-center text-[16px] w-full py-5 font-semibold bg-[#02331E] text-white rounded-[24px] hover:bg-[#02331E]"
                )}
                type="submit"
              >
                Sign Up
              </Button>
            </form>
          </Form>

          <div className="w-full py-2 px-4 text-[#02331E] mt-3 rounded-[10px] bg-[#E8F0F2] text-start">
            Free signup to unlock message
          </div>
        </div>
      </div>
    </div>
  );
}
