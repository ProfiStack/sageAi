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
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Api } from "@/shared/api/api";
import { useRouter } from "next/navigation";
import useFormToast from "../FormToast/FormToast";
import { setAuthToken } from "@/shared/utils/utils";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
const formSchema = z.object({
  email: z.string().refine(
    (value) => {
      // Email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Phone regex pattern (supports various formats)
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;

      return (
        emailPattern.test(value) ||
        phonePattern.test(value.replace(/[\s\-\(\)]/g, ""))
      );
    },
    {
      message: "Please enter a valid email address or phone number.",
    }
  ),
});
export default function Login() {
  const router = useRouter();
  const { primaryToast, destructiveToast } = useFormToast();
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values) {
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      const transformedValues = {
        name: values.name,
        ...(isEmail ? { email: values.email } : { phone_number: values.email }),
      };
      const data = await Api.client.signIn(transformedValues);
      if (data.user_id) {
        useAuthStore.getState().setUserId(data.user_id);
        await setAuthToken(data.user_id);
        localStorage.setItem("sagee_user_id", data.user_id);

        // Transfer guest quiz results to user profile if they exist
        await transferGuestQuizResults(data.user_id);

        router.push("/home");
        primaryToast({ description: "Login successful" });
      }
    } catch (error) {
      destructiveToast(error.message);
    }
  }

  // Transfer guest quiz results to user profile
  const transferGuestQuizResults = async (userId) => {
    try {
      if (typeof window !== "undefined") {
        const guestQuizResults = localStorage.getItem(
          "sagee_guest_quiz_results"
        );

        if (guestQuizResults) {
          const { skin_type, concern } = JSON.parse(guestQuizResults);

          if (skin_type || concern) {
            // Update user profile with guest quiz results
            const updateData = {
              skin_type: skin_type || "",
              concern: concern || "",
            };

            await Api.client.updateProfile(updateData, userId);
            console.log("Guest quiz results transferred to user profile");

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
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-6 space-y-6">
      <div className="w-full max-w-md flex flex-col items-center space-y-4 h-full">
        <div className="relative w-full h-full">
          <Image
            src="/images/signup.png"
            alt="Signup"
            fill
            className="object-cover rounded-[8px]"
          />
        </div>

        <p className="text-xl sm:text-2xl font-semibold text-center pt-4">
          Get answers that actually help.
        </p>
        <p className="text-[#6B7280] text-sm text-center">
          From skincare to wellness, your lifestyle agent cuts through the noise
          to guide you with insight that fits you.
        </p>
      </div>

      <div className="w-full max-w-md">
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
                  <FormControl>
                    <Input
                      className="rounded-[8px] border border-[#02331E66] w-full text-[#363636]"
                      placeholder="Email or Phone Number (starts with eg +123)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              className="w-full py-4 text-[16px] font-semibold bg-[#02331E] text-white rounded-[24px] hover:bg-[#02331E]"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        <Button
          className="w-full mt-3 py-4 text-[16px] font-semibold bg-[#D4B038] text-white rounded-[24px] hover:bg-[#D4B038]"
          onClick={() => router.push("/home")}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
