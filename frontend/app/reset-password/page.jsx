"use client";
import { useForm as useFormHook } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must have 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must have 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page
      router.push("/reset-password/success");
    } catch (error) {
      // Handle error properly - you might want to use form.setError or a toast
      console.error("Password reset failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      <div className="flex-1 bg-white">
        {/* Header */}
        <div className=" py-4 flex text-center justify-center border-b border-gray-100">
          <h1 className="text-lg font-semibold text-[#02331E]">
            Reset Password
          </h1>
        </div>

        <div className="px-4 py-4">
          {/* Logo */}
          <div className="relative w-[78px] h-[78px] mx-auto mb-2">
            <Image
              src="/images/sagelogo2.png"
              alt="SageeAi"
              layout="fill"
              objectFit="contain"
            />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#02331E] mb-3">
              Create New Password
            </h2>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full gap-4"
            >
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
                              className="w-full px-4 py-3 border-2 border-gray-200 mt-1 rounded-xl focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400 pr-12"
                              placeholder="Enter your password"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label className="block text-sm font-medium text-[#02331E] ">
                      Confirm Password
                      <FormControl>
                        <div>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="w-full px-4 py-3 border-2 border-gray-200 mt-1 rounded-xl focus:border-[#D4B038] focus:outline-none focus:ring-2 focus:ring-[#D4B038]/20 transition-all duration-300 text-[#121212] placeholder-gray-400 pr-12"
                              placeholder="Confirm your password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D4B038] transition-colors duration-200"
                            >
                              {showConfirmPassword ? (
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#D4B038] to-[#f4c842] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
