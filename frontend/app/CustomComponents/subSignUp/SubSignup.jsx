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
import { useState } from "react";
import Link from "next/link";
import { Api } from "@/shared/api/api";
import useFormToast from "../FormToast/FormToast";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/shared/utils/utils";
const formSchema = z.object({
  role: z.enum(["STARTUP", "INVESTOR"], {
    message: "You need to select a type.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

export default function SubSignup({ sub }) {
  const router = useRouter();
  const { primaryToast, destructiveToast } = useFormToast();
  const [isFounder, setIsFounder] = useState(false);
  const [isInvestor, setisInvestor] = useState(false);
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      email: "",
      fullName: "",
      password: "",
    },
  });
  async function onSubmit(values) {
    try {
      const data = await Api.client.signUp(values);
      setAuthToken(data.token);
      primaryToast({ description: data.message });
      if (values.role === "STARTUP") {
        router.push("/startup/application");
      } else {
        router.push("/");
      }
    } catch (error) {
      destructiveToast(error.message);
      console.log(error);
    }
  }
  return (
    <div className={cn("flex justify-center md-h-auto")}>
      <div>
        {sub ? (
          <div>
            <p className="text-center  text-[40px] font-bold text-[#014367]">
              You got this far?
            </p>
            <p className="text-center text-[40px] font-bold text-[#014367]">
              Time to sign up!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8">
            <p className="text-[20px] md:text-[48px] font-semibold text-[#014367] tracking-[0.96px] ">
              Invest in projects that matter
            </p>
            <p className="md:text-[24px] text-[12px] font-light  text-[#014367]">
              Join Naimaat and make a difference while growing your portfolio
            </p>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-0 mb-3"
                        check={false}
                      >
                        <FormItem
                          className={cn(
                            "flex justify-center items-center h-[50px] w-[140px] md:h-[60px] md:w-[196px] space-y-0 border rounded-l-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            isInvestor && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem
                              check={false}
                              value="INVESTOR"
                              onClick={() => {
                                setIsFounder(false), setisInvestor(true);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="flex text-[16px] md:text-[20px] w-full h-full text-center items-center justify-center cursor-pointer">
                            Investor
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className={cn(
                            "flex justify-center items-center h-[50px] w-[140px] md:h-[60px] md:w-[196px] space-y-0 border  rounded-r-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            isFounder && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem
                              classname=""
                              value="STARTUP"
                              onClick={() => {
                                setIsFounder(true), setisInvestor(false);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="flex text-[16px] md:text-[20px] w-full h-full text-center items-center justify-center cursor-pointer">
                            Founder
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                        className="mb-3 rounded-[8px] border-[#ADB9C9] border-2 w-[280px] h-[40px] md:w-[390px] md:h-[55px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="mb-3 rounded-[8px] border-[#ADB9C9] border-2 w-[280px] h-[40px] md:w-[390px] md:h-[55px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-6 rounded-[8px] border-[#ADB9C9] border-2 w-[280px] h-[40px] md:w-[390px] md:h-[55px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
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
                "flex justify-center text-[18px] w-[280px] h-[40px] md:w-[390px] md:h-[50px] font-bold bg-[#014367] text-white rounded-[8px] hover:bg-[#023450]"
              )}
              type="submit"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="flex justify-center items-center gap-2 mt-3">
          <p className="text-[14px] md:text-[20px]">Already have an account?</p>
          <Link href={"/login"} className="">
            <p className="text-[14px] md:text-[20px] text-[#007AFF]">Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
