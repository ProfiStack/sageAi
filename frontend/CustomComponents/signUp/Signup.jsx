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
const formSchema = z.object({
  gender: z.enum(["male", "female", "none"], {
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
  country: z.string().min(2, { message: "Select a country" }),
  terms: z.boolean({
    message: "Please read and accept terms and conditions ",
  }),
  services: z.boolean(),
});

export default function Signup() {
  const router = useRouter();
  const { primaryToast, destructiveToast } = useFormToast();
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsfemale] = useState(false);
  const [isNone, setisNone] = useState(false);
  const options = useMemo(() => countryList().getData(), []);
  const form = useFormHook({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "",
      email: "",
      fullName: "",
      password: "",
      country: "",
      terms: false,
      services: false,
    },
  });
  const handleLogoClick = () => {
    router.push("/");
  };
  async function onSubmit(values) {
    try {
      if (values.terms) {
        console.log(values);
        const data = await Api.client.signUp(values);
        setAuthToken(data.token);
        primaryToast({ description: data.message });

        router.push("/");
      } else {
        destructiveToast("Please read and accept terms and conditions");
      }
    } catch (error) {
      destructiveToast(error.message);
      console.log(error);
    }
  }

  return (
    <div>
      <div className="space-y-2 my-6  flex justify-center flex-col items-center">
        <button onClick={() => handleLogoClick()}>
          <Image src="/images/sageLogo2.png" width={78} height={78} />
        </button>
        <p className=" text-2xl font-semibold">Create Account</p>
        <p className="text-[#6B7280] text-sm">
          Join us today! Please enter your details.
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
                  <p className="text-sm text-[#374151] mb-2">Full Name</p>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="mb-3 placeholder:text-[#ADAEBC] rounded-[8px] border-[#E5E7EB] border w-[280px] h-[40px] md:w-[390px] md:h-[55px] text-[#363636] focus:border-[#02331E] focus:ring-[#02331E] focus:ring-opacity-50"
                            placeholder="Jhon Doe"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
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
                <div className="flex flex-col items-start justify-start w-full mb-3">
                  <p className="text-sm mb-2 text-[#374151]">Gender</p>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            check={false}
                          >
                            <div className="flex gap-2 items-center">
                              <FormItem
                                className={cn(
                                  "flex justify-center items-center h-[50px] w-[92px] md:h-[60px] md:w-[196px] space-y-0 border rounded-[8px] border-[#E5E7EB] hover:bg-[#02331E] transition-all duration-30 hover:text-white",
                                  isMale && "bg-[#02331E] text-white"
                                )}
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    check={false}
                                    value="male"
                                    onClick={() => {
                                      setIsfemale(false),
                                        setIsMale(true),
                                        setisNone(false);
                                    }}
                                  />
                                </FormControl>

                                <FormLabel className="flex text-sm md:text-[20px] w-full h-full text-center items-center justify-center cursor-pointer">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem
                                className={cn(
                                  "flex justify-center items-center h-[50px] w-[92px] md:h-[60px] md:w-[196px] space-y-0 border  rounded-[8px] border-[#E5E7EB] hover:bg-[#02331E] transition-all duration-30 hover:text-white",
                                  isFemale && "bg-[#02331E] text-white"
                                )}
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    classname=""
                                    value="female"
                                    onClick={() => {
                                      setIsfemale(true),
                                        setIsMale(false),
                                        setisNone(false);
                                    }}
                                  />
                                </FormControl>

                                <FormLabel className="flex text-sm md:text-[20px] w-full h-full text-center items-center justify-center cursor-pointer">
                                  Female
                                </FormLabel>
                              </FormItem>
                            </div>
                            <FormItem
                              className={cn(
                                "flex justify-center items-center h-[50px] w-[152px] md:h-[60px] md:w-[196px] space-y-0 border  rounded-[8px] border-[#E5E7EB] hover:bg-[#02331E] transition-all duration-30 hover:text-white",
                                isNone && "bg-[#02331E] text-white"
                              )}
                            >
                              <FormControl>
                                <RadioGroupItem
                                  classname=""
                                  value="none"
                                  onClick={() => {
                                    setIsMale(false),
                                      setIsfemale(false),
                                      setisNone(true);
                                  }}
                                />
                              </FormControl>

                              <FormLabel className="flex text-sm md:text-[20px] w-full h-full text-center items-center justify-center cursor-pointer">
                                prefer not to say
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <p className="text-sm text-[#374151] mb-2">Country</p>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          className="relative"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className=" w-[280px] md:w-[390px] h-[40px] md:h-[55px] border-[#E5E7EB] rounded-[8px] text-[#363636] focus:ring-[#02331E] focus:border-[#02331E]">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className=" absolute h-[160px] bg-white border border-[#E5E7EB] rounded-xl">
                            <SelectGroup>
                              {options.map((option) => (
                                <SelectItem
                                  className="px-2"
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-start w-full mt-2">
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="terms"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm text-[#4B5563] font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Accept terms and conditions
                            </label>
                          </div>
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-start w-full mt-2 mb-6">
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex space-x-3">
                            <Checkbox
                              id="services"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium text-[#4B5563] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              I agree to receive marketing{" "}
                              <br className="flex md:hidden" /> communications
                              from SageeAi
                            </label>
                          </div>
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
