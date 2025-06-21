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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Api } from "@/shared/api/api";
import useFormToast from "../FormToast/FormToast";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/shared/utils/utils";
import Image from "next/image";
import countryList from "react-select-country-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "@/store/authStore";
const formSchema = z.object({
 
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

export default function Signup() {
  const router = useRouter();
  const { primaryToast, destructiveToast } = useFormToast();
 
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      
    },
  });
  const handleLogoClick = () => {
    router.push("/");
  };
  async function onSubmit(values) {
    try {
    
        const data = await Api.client.signUp(values);
        if (data.token) {
          useAuthStore.getState().setToken(data.token);
          await setAuthToken(data.token);
          primaryToast({ description: data.message });
          router.push("/");
        }
      
    } catch (error) {
      destructiveToast(error.message);
    }
  }

  return (
    <div>
      <div className="space-y-2 w-full  flex justify-center flex-col items-center">
        
          <div className="relative p-4 w-full h-[537px]">
          <Image src="/images/signup.png" objectFit="cover" layout="fill" className="rounded-3xl"/>
          </div>
        
        <p className=" text-2xl font-semibold">Get answers that actually help.</p>
        <p className="text-[#6B7280] text-sm">
        From skincare to wellness, your lifestyle agent cuts through the noise to guide you with insight that fits you.
        </p>
      </div>
      <div className={cn("flex justify-center md-h-auto")}>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center gap-2">
               
                <div>
                  <p className="text-sm text-[#374151] mb-2">Email</p>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="mb-3 placeholder:text-[#ADAEBC] rounded-[8px] border-[#E5E7EB] border w-[280px] h-[40px] md:w-[390px] md:h-[55px] text-[#363636] focus:border-[#02331E] focus:ring-[#02331E] focus:ring-opacity-50"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />{" "}
                </div>
                <div>
                  <p className="text-sm text-[#374151] mb-2">Password</p>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            className="mb-3 placeholder:text-[#ADAEBC] rounded-[8px] border-[#E5E7EB] border w-[280px] h-[40px] md:w-[390px] md:h-[55px] text-[#363636] focus:border-[#02331E] focus:ring-[#02331E] focus:ring-opacity-50"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
                

              <Button
                className={cn(
                  "flex justify-center text-[16px] w-[280px] md:w-[390px] py-5 font-semibold bg-[#02331E] text-white rounded-[8px] hover:bg-[#02331E]"
                )}
                type="submit"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <div className="flex justify-center items-center gap-2 mt-3 mb-6">
            <p className="text-[14px] md:text-[20px] text-[#4B5563]">
              Already have an account?
            </p>
            <Link href={"/login"} className="">
              <p className="text-[14px] md:text-[20px] font-medium text-[#02331E]">
                Sign in
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
