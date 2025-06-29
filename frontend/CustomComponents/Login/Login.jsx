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
      const data = await Api.client.signIn(values);
      console.log(data.user_id);
      if (data.user_id) {
        useAuthStore.getState().setUserId(data.user_id);
        await setAuthToken(data.user_id);
        localStorage.setItem("sagee_user_id", data.user_id);
        router.push("/");
        primaryToast({ description: "Login successful" });
      }
    } catch (error) {
      destructiveToast(error.message);
    }
  }
  return (
    <div>
      <div className="space-y-2 w-full p-4   flex justify-center flex-col items-center">
        <div className="relative w-full h-[537px]">
          <Image
            src="/images/signup.png"
            alt="Signup"
            fill
            style={{ objectFit: "fill" }}
            className="rounded-3xl"
          />
        </div>

        <p className=" text-2xl font-semibold pt-7">
          Get answers that actually help.
        </p>
        <p className="text-[#6B7280] text-sm text-center">
          From skincare to wellness, your lifestyle agent cuts through the noise
          to guide you with insight that fits you.
        </p>
      </div>
      <div className={cn("flex px-4 w-full md-h-auto")}>
        <div className="w-full">
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

          <Button
            className={cn(
              "flex justify-center mt-3 text-[16px] w-full py-5 font-semibold bg-[#D4B038] text-white rounded-[24px] hover:bg-[#D4B038]"
            )}
            onClick={() => router.push("/")}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
