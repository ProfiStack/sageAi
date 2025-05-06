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
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
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
      if (data.token) {
        useAuthStore.getState().setToken(data.token);
        await setAuthToken(data.token);
      }
      primaryToast({ description: data.message });
      router.push("/");
    } catch (error) {
      destructiveToast(error.message);
      console.log(error);
    }
  }
  return (
    <div className="container mx-auto">
      <div className="flex justify-center pt-[0px]  md:pt-[122px]  h-auto  ">
        <div>
          <div className="flex flex-col items-center mb-5">
            <p className="text-[24px] md:text-[48px] font-semibold text-[#014367] ">
              Hi! Welcome back!
            </p>
            <div className="flex items-center">
              <p className=" text-[14px]  md:text-[16px] font-normal text-black">
                New to Naimaat?
              </p>
              <div className="w-1"></div>
              <a
                className="text-[14px] md:text-[16px] font-normal  text-[#007AFF]"
                href="/signup"
              >
                Sign up
              </a>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="mb-3 rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] md:h-[55px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
                          placeholder="Email"
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
                        <Input
                          type="password"
                          className="mb-3 rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] md:h-[55px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className={cn(
                  "flex justify-center text-[18px] w-[280px] md:w-[390px] h-[40px] md:h-[50px] font-bold bg-[#014367] text-white rounded-[8px] hover:bg-[#023450]"
                )}
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>
          <Link
            href={"/forgot-password"}
            className="flex justify-center items-center mt-4 "
          >
            <p className="font-normal text-[16px] text-[#007AFF]">
              Forgot Password?
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
