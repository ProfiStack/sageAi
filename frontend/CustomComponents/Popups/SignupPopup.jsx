"use client";
import {
  cn,
  resetGuestMessageCount,
  transferGuestQuizResults,
} from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useFormHook } from "react-hook-form";

import { usePostHog } from "@/app/providers/posthogProvider";
import { setAuthToken, setLoginTimestamp } from "@/shared/utils/utils";
import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import useFormToast from "../FormToast/FormToast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
  // const { logEvent } = usePostHog();
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { destructiveToast, primaryToast } = useFormToast();
  async function onSubmit(values) {
    try {
      // logEvent("Onboard Option Clicked", {
      //   click_value: "Sign Up",
      //   click_location: "Onboarding",
      // });
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
        // logEvent("Onboard Sucessful");
        await transferGuestQuizResults(data.token);
        router.push("/");
        primaryToast({ description: "Sign-Up successful" });
      } else if (data.detail) {
        destructiveToast(data.detail);
      }
    } catch (error) {
      destructiveToast(error.message);
    }
  }

  return (
    <div className="fixed inset-0   flex items-end bottom-[78px] justify-center   ">
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
                            placeholder="Email"
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

              <button
                className={cn(
                  "flex justify-center text-[16px] w-full py-5 font-semibold bg-[#D4B038] text-white rounded-[24px] hover:bg-[#D4B038]"
                )}
                type="submit"
              >
                Sign Up
              </button>
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
