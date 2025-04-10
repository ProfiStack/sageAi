"use client";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const formSchema = z.object({
  startupname: z.string().min(2, {
    message: "Startup name must be at least 2 characters.",
  }),
  industry: z.string().min(2, {
    message: "Please Select Industry",
  }),

  country: z.string().min(2, {
    message: "Please Select Country",
  }),
});
export default function KnowCustomer() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startupname: "",
      industry: "",
      country: "",
    },
  });
  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="pb-10 pt-10 md:pt-20 md:pb-20 bg-[#F3F4F6]">
      <div>
        <div className="flex justify-center items-center md:gap-20">
          <div className="w-[70px] h-[70px] md:w-[120px] md:h-[120px]">
          <Image
            className="-translate-y-4"
            width={120}
            height={120}
            src={'/images/ShakeHand.png'}
          />
          </div>
          <p className="text-[18px] md:text-[40px] font-bold text-[#014367]">
            Now let’s get to know you...
          </p>
          <div className="w-[70px] h-[70px] md:w-[120px] md:h-[120px]">
          <Image
            className=" md:translate-x-14 md:translate-y-5"
            width={120}
            height={120}
            src={'/images/Globe.png'}
          />
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-center md:w-[856px] text-[12px] md:text-[18px] text-[#545B79] md:-translate-y-4 md:mb-10">
            We’d love to learn more about your big idea to help tailor the best
            support and opportunities for you. Choose your industry, country,
            and share your startup name below.
          </p>
        </div>
      </div>
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col items-center justify-center"
        >
          <div className=" flex flex-col  md:flex-row justify-center  items-center gap-2 md:gap-10 w-full px-8  md:w-screen   ">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className='w-full md:w-[300px]  '>
                  <FormLabel >What industry are you part of?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl  >
                      <SelectTrigger className="rounded-[8px] border-[#C3C5CE] bg-white     ">
                        <SelectValue placeholder="Select Industry"  />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white z-10">
                      <SelectItem value="m@example.com">
                        m@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className='w-full md:w-[300px]'>
                  <FormLabel>Where are you based?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-[8px] border-[#C3C5CE]  bg-white  md:gap-14 ">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white z-10">
                      <SelectItem value="salman@example.com">
                        salman@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startupname"
              render={({ field }) => (
                <FormItem className='w-full md:w-[300px]'>
                  <FormLabel>What’s your startup called?</FormLabel>
                  <FormControl >
                    <Input
                      className="rounded-[8px] border-[#C3C5CE] bg-white   "
                      placeholder="Startup Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className={cn(
              "flex justify-center text-[18px] font-medium  px-6 py-[9px] bg-[#014367] text-white rounded-[10px] mb-8 hover:bg-[#014367]"
            )}
            type="submit"
          >
            Help me get funded <ArrowRight className="ml-2" size={18} />
          </Button>
        </form>
      </Form>
    </div>
  );
}
