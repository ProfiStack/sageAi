"use client";
import { useForm as useFormHook } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Api } from "@/shared/api/api";
import { useRouter } from "next/navigation";
import useFormToast from "../FormToast/FormToast";
import { setAuthToken, setLoginTimestamp } from "@/shared/utils/utils";
import useAuthStore from "@/store/authStore";
import { usePostHog } from "@/app/providers/posthogProvider";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { transferGuestQuizResults } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  name: z.string({ message: "Please enter your name" }),

  password: z.string().min(6, {
    message: "Password should contain minimum 6 characters",
  }),
});
export default function Signup() {
  const router = useRouter();
  const { logEvent } = usePostHog();
  const { primaryToast, destructiveToast } = useFormToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  async function onSubmit(values) {
    setIsLoading(true);

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
        await setLoginTimestamp(Date.now());
        localStorage.setItem("token", data.token);
        localStorage.setItem("sagee_user_id", decoded.user_id);
        const store = useAuthStore.getState();
        store.setUserId(decoded.user_id);
        store.setName(decoded.name);
        store.setToken(data.token);
        store.setIsAuthenticated(true);
        store.setIsSubscribed(data.subscription);
        logEvent("Onboard Sucessful");
        await transferGuestQuizResults(data.token);
        primaryToast({ description: "Signup successful" });
        setIsLoading(false);
        router.push("/onboarding");
      } else if (data.detail) {
        setIsLoading(false);
        destructiveToast(data.detail);
      }
    } catch (error) {
      destructiveToast(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-[#D4B038]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <div className="  bg-[#F5F5F5] shadow-2xl min-h-screen relative overflow-hidden flex px-6 pt-[100px]">
        <div className="flex flex-col justify-center items-center w-full bg-[#ffffff] p-6 rounded-[16px] h-max">
          <p className="text-[22px] flex justify-center">Sign Up</p>
          <p className="text-[13px] text-[#525252] mb-6">
            Join SageeAI and get started
          </p>

          {/* Main Content */}
          <div className="relative z-10 w-full ">
            <div className="mb-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col w-full gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-full px-4 py-3 border-2 border-[#D1D5DB] mt-1 rounded-xl placeholder:text-[#9CA3AF] focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400"
                            placeholder="Full Name"
                            type="text"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-full px-4 py-3 border-2 border-[#D1D5DB] mt-1 rounded-xl placeholder:text-[#9CA3AF] focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400"
                            placeholder="Email "
                            type="email"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 border-2 border-[#D1D5DB] mt-1 placeholder:text-[#9CA3AF] rounded-xl focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400 pr-12"
                                placeholder="Password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D4B038] transition-colors duration-200"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    className="w-full py-4 text-[16px] font-medium bg-[#D4B038] text-white placeholder:text-[#9CA3AF] rounded-[12px] hover:bg-[#D4B038]"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </form>
              </Form>
              {/*  <button
              onClick={() => router.push("/forgot-password")}
              className="underline underline-offset-4 flex justify-center w-full text-[#02331E] mt-2 "
            >
              Forgot Password?
            </button>*/}
              <div className="flex items-center gap-1 justify-center mt-4">
                <p className="text-[#525252] text-[13px]">
                  Already have an account?{" "}
                </p>
                <button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="text-[#D4B038] text-[14px]"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
