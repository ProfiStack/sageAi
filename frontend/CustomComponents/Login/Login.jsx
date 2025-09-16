"use client";
import { useForm as useFormHook } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import {
  setUserId,
  setAuthToken,
  setLoginTimestamp,
} from "@/shared/utils/utils";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { useAmplitude } from "@/app/providers/amplitudeProvider";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lightbulb } from "lucide-react";
import { useState } from "react";
import { comingSoonData, featuresData } from "@/mockData/loginMockData";
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
export default function Login() {
  const router = useRouter();
  const { logEvent } = useAmplitude();
  const { primaryToast, destructiveToast } = useFormToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
        store.setToken(data.token);
        store.setIsAuthenticated(true);
        store.setIsSubscribed(data.subscription);
        logEvent("Onboard Sucessful");
        router.push("/home");
        primaryToast({ description: "Login successful" });
        setIsLoading(false);
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

  const features = featuresData;
  const comingSoon = comingSoonData;

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
      <div className=" mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5"></div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#D4B038]/25 to-[#02331E]/25 px-4 py-6 text-center overflow-hidden rounded-b-3xl">
          {/* Logo */}
          <div className="relative z-10 mb-2">
            <div className="w-20 h-20 mx-auto mb-2 bg-white rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/sagelogo.png"
                fill
                alt="sage"
                className="object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold text-[#02331E] mb-1 tracking-tight">
              SageeAi
            </h1>
            <p className="text-[#02331E]  font-semibold">
              Meet Sagee, your beauty & wellness glow up guide
            </p>
          </div>
          <p className="text-[#02331E] text-sm max-w-xs mx-auto">
            Real advice from real dermatologists and AI that actually gets your
            skin. Save £100s on products that don't work and hours of research.
            Trusted by 1000 beauty lovers, real results, real routines. Your
            data is private and secure, we never share your information
          </p>{" "}
        </div>
        {/* Main Content */}
        <div className="relative z-10 px-4 py-4">
          <div className="mb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-[#02331E] ">
                        Email
                        <FormControl>
                          <Input
                            className="w-full px-4 py-3 border-2 border-gray-200 mt-1 rounded-xl placeholder:text-gray-400 focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400"
                            placeholder="Enter your email (so we can save your glow progress)"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                      </Label>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-sm font-medium text-[#02331E] ">
                        Password
                        <FormControl>
                          <div>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 border-2 border-gray-200 mt-1 placeholder:text-gray-400 rounded-xl focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400 pr-12"
                                placeholder="Create a secure password"
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
                      </Label>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full py-4 text-[16p-font-medium bg-[#02331E] text-white placeholder:text-gray-400 rounded-[24px] hover:bg-[#02331E]"
                  type="submit"
                >
                  Sign In / Sign Up to my glow
                </Button>
              </form>
            </Form>
            {/*  <button
              onClick={() => router.push("/forgot-password")}
              className="underline underline-offset-4 flex justify-center w-full text-[#02331E] mt-2 "
            >
              Forgot Password?
            </button>*/}
          </div>
          {/* Features Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-[#D4B038] to-[#f4c842] rounded-full"></div>
              <p className="text-xl font-bold text-[#02331E]">
                What You'll Get:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10  border border-gray-100 rounded-xl p-3 shadow-lg hover:border-[#D4B038]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4B038] to-[#f4c842] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className=" p-2 mb-2  bg-gradient-to-r from-[#D4B038]/10 to-[#02331E]/10 rounded-full flex items-center justify-center text-[#D4B038]  group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h1 className="font-medium text-sm leading-tight text-[#02331E]">
                      {feature.title}
                    </h1>
                  </div>

                  <h3 className=" font-normal text-xs text-[#02331E] leading-tight ">
                    {feature.subTitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-4 mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-2 py-4 border border-emerald-100 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-100 rounded-full p-1">
              <div className="p-2 bg-emerald-500 rounded-full flex items-center justify-center">
                <Lightbulb color="white" />
              </div>
            </div>
            <div className="flex-1 ">
              <p className="text-sm text-emerald-700 font-medium mb-1">
                DID YOU KNOW?
              </p>

              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold text-emerald-700">
                  Average user saves £150+ per year on products that don't work
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#D4B038] to-[#f4c842] rounded-full"></div>
            <h2 className="text-xl font-bold text-[#02331E]">Coming Soon</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {comingSoon.map((item, index) => (
              <div
                key={index}
                className="group bg-gradient-to-r from-orange-500/5 to-red-500/5  border border-[#D4B038]/20 rounded-xl py-4 px-2 text-center shadow-lg hover:border-[#D4B038]/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0  to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative px-2  ">
                  <div className="w-10 h-10  bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full flex items-center justify-center text-[#D4B038] mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-medium text-[#02331E] w-full">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              New features added weekly based on what you actually need. Join
              now and help shape SageeAI's future.
            </p>
            <p className="text-xs text-[#D4B038] font-medium">
              Sageai is just getting started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
