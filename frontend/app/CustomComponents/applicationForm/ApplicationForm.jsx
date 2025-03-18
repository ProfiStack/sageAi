"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import useFormToast from "../FormToast/FormToast";
import { useRouter } from "next/navigation";
import { Api } from "@/shared/api/api";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Fill the company name field",
  }),
  website: z.string().min(2, {
    message: "Fill the company website field",
  }),
  description: z.string().min(2, {
    message: "Please add description",
  }),
  industry: z.string().min(2, {
    message: "Please Select Industry",
  }),
  logo: z.instanceof(File, { message: "Please upload a logo" }), // Ensure the uploaded value is a File
  titleImage: z.instanceof(File, { message: "Please upload a title image" }), // Ensure the uploaded value is a File
  moneyToBeRaised: z.number().min(2, {
    message: "Fill the raise money field",
  }),
  moneyRaised: z.number().min(2, {
    message: "Fill the raised money field",
  }),
  productAvailable: z.boolean().refine((val) => val === true || val === false, {
    message: "You need to select one option",
  }),
  generatingRevenue: z
    .boolean()
    .refine((val) => val === true || val === false, {
      message: "You need to select one option",
    }),
  pitchDeckFile: z
    .instanceof(File, { message: "Please upload a file" })
    .nullable()
    .optional(),
  pitchDeckUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .nullable()
    .optional(),
  audienceSize: z.string().min(2, {
    message: "Fill the community size field ",
  }),
  investmentCampaign: z
    .boolean()
    .refine((val) => val === true || val === false, {
      message: "You need to select one option",
    }),
  companysRunaway: z.number().min(2, {
    message: "Fill the company runway field",
  }),
});

export default function Application() {
  const [inputType, setInputType] = useState("url");
  const { primaryToast, destructiveToast } = useFormToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      website: "",
      description: "",
      industry: "",
      logo: null,
      titleImage: null,
      moneyRaised: 0,
      moneyToBeRaised: 0,
      productAvailable: false,
      generatingRevenue: false,
      pitchDeckFile: null,
      pitchDeckUrl: "",
      audienceSize: "",
      investmentCampaign: false,
      companysRunaway: 0,
    },
  });
  async function onSubmit(values) {
    try {
      setIsSubmitted(true);
      values.pitchDeck = values.pitchDeckFile || values.pitchDeckUrl;
      const data = await Api.client.startUpSignUp(values);
      primaryToast({ description: data.message });
      if (data.status === 200 || data.status === 201) {
        router.push("/startup/success");
      }
    } catch (error) {
      destructiveToast(error.message);
      console.log(error);
      setIsSubmitted(false);
    }
  }
  return (
    <div className="overflow-x-hidden ">
      <div className=" md:ps-[201px] md:py-[53px] bg-[#B3DADE26] py-5">
        <p className=" text-center md:text-start tracking-tighter md:tracking-normal md:items-start text-[24px] font-bold md:text-[49px] md:font-black text-[#014367]">
          Apply to raise funds on Naimaat
        </p>
        <p className=" text-center md:text-start px-3 md:px-0 text-[12px] font-normal tracking-tight ">
          All information provided in this application is strictly for internal
          use and will be kept highly confidential.
          <br className="hidden md:flex" /> Companies may submit applications to
          raise with Naimaat multiple times.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 md:space-y-8 flex flex-col "
        >
          <div className=" flex flex-col md:ps-[201px] justify-center  gap-2 md:gap-7 w-full px-4 md:px-8">
            <div className="pt-8">
              <p className="text-[28px] md:text-[38px] font-bold md:font-semibold ">
                About Your Company
              </p>
            </div>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20  ">
                      <Input
                        className="rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50 "
                        {...field}
                      />
                      <p className="text-[16px] font-light">
                        This should be the name your company uses on your
                        website and in the market.
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20   ">
                      <Input
                        className="rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50 "
                        {...field}
                      />
                      <p className="text-[16px] font-light">
                        Fill a small description for the company.
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Company Website
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20   ">
                      <Input
                        placeholder="https://"
                        className="rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50  "
                        {...field}
                      />
                      <p className="text-[16px] font-light">
                        Please enter a valid URL that represents your company.
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Industry
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20   ">
                        <SelectTrigger className="rounded-[8px] w-[280px]  border-2 border-[#C3C5CE] flex justify-between  bg-white   md:w-[387px] h-[45px]     ">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <p className="text-[16px] font-light">
                          The industry your company operates in.
                        </p>
                      </div>
                    </FormControl>
                    <SelectContent className="bg-white z-10">
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Arts & Entertainment">
                        Arts & Entertainment
                      </SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Biotechnology">
                        Biotechnology
                      </SelectItem>
                      <SelectItem value="Business Services">
                        Business Services
                      </SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Consumer Services">
                        Consumer Services
                      </SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Information Technology">
                        Information Technology
                      </SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Nonprofit">Nonprofit</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Telecommunications">
                        Telecommunications
                      </SelectItem>
                      <SelectItem value="Transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className=" space-y-4">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Logo
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20  ">
                      <div>
                        {/* Hidden input field */}
                        <Input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                        {/* Custom button/label to trigger file input */}
                        <label htmlFor="file-upload">
                          <div className="flex items-center cursor-pointer pl-2 w-[280px] md:w-[387px] h-[45px] justify-between pe-4 rounded-[8px] py-2 border-2  border-[#C3C5CE] text-black">
                            <span>
                              {" "}
                              {field.value ? field.value.name : "Upload"}
                            </span>
                            <Upload color="#696565" />
                          </div>
                        </label>
                      </div>
                      <p className="text-[16px] font-light">
                        Logo of your company
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titleImage"
              render={({ field }) => (
                <FormItem className=" space-y-4">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Title Image
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20  ">
                      <div>
                        {/* Hidden input field */}
                        <Input
                          type="file"
                          id="file-upload-1"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                        {/* Custom button/label to trigger file input */}
                        <label htmlFor="file-upload-1">
                          <div className="flex items-center cursor-pointer pl-2 w-[280px] md:w-[387px] h-[45px] justify-between pe-4 rounded-[8px] py-2 border-2  border-[#C3C5CE] text-black">
                            <span>
                              {" "}
                              {field.value ? field.value.name : "Upload"}
                            </span>
                            <Upload color="#696565" />
                          </div>
                        </label>
                      </div>
                      <p className="text-[16px] font-light">
                        Title image of your company
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <hr className="border-[#C3C5CE] border-[1px] md:me-[153px] my-5" />
            <div>
              <p className="text-[28px] md:text-[38px] font-bold md:font-semibold ">
                Funding Information
              </p>
            </div>
            <FormField
              control={form.control}
              name="moneyToBeRaised"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    How much would you like to raise on Naimaat?
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20   ">
                      <span className="absolute left-2 px-2 top-[10px] md:top-3">
                        ${" "}
                      </span>
                      <Input
                        type="number"
                        className="rounded-[8px] border-2 w-[280px] md:w-[387px]  border-[#C3C5CE] bg-white ps-8 h-[45px]  focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <p className="text-[16px] font-light">
                        We encourage you to set a specific target,Though your
                        <br className="hidden md:flex" /> total potential raise
                        will be subject to SEC regulations.
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moneyRaised"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    How much money your company has raised?
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20    ">
                      <span className="absolute left-2 px-2 top-[10px] md:top-3">
                        ${" "}
                      </span>
                      <Input
                        type="number"
                        className="rounded-[8px] border-2 w-[280px] md:w-[387px]  border-[#C3C5CE] bg-white ps-8 h-[45px] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <p className="text-[16px] font-light">
                        The sum total of past financing, including angel or
                        venture capital, loans,
                        <br className="hidden md:flex" /> grants, or token
                        sales.
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productAvailable"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Is your product available (for sale) in market?
                  </FormLabel>
                  <div className="flex flex-col md:flex-row md:items-center gap-y-2  md:gap-[269px]">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-0"
                      >
                        <FormItem
                          className={cn(
                            "flex items-center justify-center space-y-0  h-[45px] w-[100px]  border rounded-l-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            field.value === true && "bg-[#014367] text-white "
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={true} />
                          </FormControl>
                          <FormLabel className="font-medium text-sm relative py-2 px-11  cursor-pointer">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className={cn(
                            "flex items-center justify-center h-[45px] w-[100px] space-y-0  border rounded-r-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            field.value === false && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={false} />
                          </FormControl>
                          <FormLabel className="relative m-0 p-0 font-medium text-sm py-2 px-11 cursor-pointer ">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <p className="text-[16px] font-light">
                      Only check this box if customers can access, use, or buy
                      your product today
                    </p>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generatingRevenue"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    Is your company generating revenue?
                  </FormLabel>
                  <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-[269px]    ">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-0 "
                      >
                        <FormItem
                          className={cn(
                            "flex items-center justify-center space-y-0 h-[45px] w-[100px] border rounded-l-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            field.value === true && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={true} />
                          </FormControl>
                          <FormLabel className="font-medium text-sm relative  py-2 px-11 cursor-pointer">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className={cn(
                            "flex items-center justify-center space-y-0 h-[45px] w-[100px] border rounded-r-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            field.value === false && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={false} />
                          </FormControl>
                          <FormLabel className="relative m-0 p-0 font-medium text-sm py-2 px-11 cursor-pointer">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <p className="text-[16px] font-light">
                      Only check this box if your company is making money.
                      Please elaborate on <br className="hidden md:flex" />{" "}
                      revenue and other traction below.
                    </p>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <hr className="border-[#C3C5CE] border-[1px] md:me-[153px] my-5" />
            <div>
              <p className="text-[28px] md:text-[38px] font-bold md:font-semibold">
                Pitch Deck
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20  ">
              <div>
                <FormField
                  control={form.control}
                  name="inputType"
                  render={() => (
                    <FormItem className="mb-4">
                      <RadioGroup
                        defaultValue={inputType}
                        onValueChange={(value) => setInputType(value)} // Update state based on selection
                      >
                        <div className="flex items-center">
                          <FormItem
                            className={cn(
                              "flex justify-center items-center h-[50px] w-[100px] md:w-[150px] space-y-0 border rounded-l-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                              inputType === "url" && "bg-[#014367] text-white"
                            )}
                            onClick={() => {
                              setInputType("url");
                              form.setValue("pitchDeckFile ", "");
                            }} // Ensure clicking the entire item works
                          >
                            <FormControl>
                              <RadioGroupItem value="url" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "flex text-[16px] w-full h-full text-center items-center justify-center cursor-pointer",
                                inputType === "url" && "text-white"
                              )}
                            >
                              Paste Url
                            </FormLabel>
                          </FormItem>

                          <FormItem
                            className={cn(
                              "flex justify-center items-center h-[50px] w-[100px] md:w-[150px] space-y-0 border rounded-r-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                              inputType === "upload" &&
                                "bg-[#014367] text-white"
                            )}
                            onClick={() => {
                              setInputType("upload");
                              form.setValue("pitchDeckUrl", null);
                            }} // Ensure clicking the entire item works
                          >
                            <FormControl>
                              <RadioGroupItem value="upload" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "flex text-[16px] w-full h-full text-center items-center justify-center cursor-pointer",
                                inputType === "upload" && "text-white"
                              )}
                            >
                              Upload File
                            </FormLabel>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormItem>
                  )}
                />

                {/* Conditionally render input fields based on radio button selection */}
                <FormField
                  control={form.control}
                  name={
                    inputType === "upload" ? "pitchDeckFile" : "pitchDeckUrl"
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        {inputType === "upload" ? (
                          <div>
                            {/* Hidden input field */}
                            <Input
                              type="file"
                              name="pitchDeckFile"
                              id="pitch-deck-file-upload"
                              className="hidden "
                              onChange={(e) => {
                                field.onChange(e.target.files[0]); // update field
                              }}
                            />
                            {/* Custom button/label to trigger file input */}
                            <label htmlFor="pitch-deck-file-upload">
                              <div className="flex items-center cursor-pointer pl-2 w-[280px] md:w-[387px] h-[45px] justify-between pe-4 rounded-[8px] py-2 border-2  border-[#C3C5CE] text-black">
                                <span>
                                  {" "}
                                  {field.value ? field.value.name : "Upload"}
                                </span>
                                <Upload color="#696565" />
                              </div>
                            </label>
                          </div>
                        ) : (
                          <Input
                            name="pitchDeckUrl"
                            placeholder="https://"
                            className="rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50  "
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <p className="text-[16px] font-light w-[636px]">
                  Your pitch deck and other application info will be used for
                  internal purposes only. Please make sure this document is
                  publicly accessible. This can be a DocSend, Box, Dropbox,
                  Google Drive or other link.
                </p>
              </div>
            </div>
            <hr className="border-[#C3C5CE] border-[1px] md:me-[153px] my-5" />
            <div>
              <p className="text-[28px] md:text-[38px] font-bold md:font-semibold ">
                Community Information
              </p>
            </div>
            <FormField
              control={form.control}
              name="audienceSize"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    What's the rough size of your community?
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20   ">
                      <Input
                        className="rounded-[8px] border-2 w-[280px] md:w-[387px]  border-[#C3C5CE] bg-white  h-[45px] "
                        {...field}
                      />
                      <p className="text-[16px] font-light">
                        The rough size of your current audience.
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investmentCampaign"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    My company has run an investment compaign{" "}
                    <br className="hidden md:flex" />
                    {"(Reg CF or Reg A+)"} in the past
                  </FormLabel>
                  <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-[269px]  ">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-0 "
                      >
                        <FormItem
                          className={cn(
                            "flex items-center justify-center space-y-0 h-[45px] w-[100px] border rounded-l-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            field.value === true && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={true} />
                          </FormControl>
                          <FormLabel className="font-medium text-sm relative  py-2 px-11 cursor-pointer">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className={cn(
                            "flex items-center justify-center space-y-0 h-[45px] w-[100px] border rounded-r-[8px] border-[#ADB9C9] hover:bg-[#014367] transition-all duration-30 hover:text-white",
                            field.value === false && "bg-[#014367] text-white"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value={false} />
                          </FormControl>
                          <FormLabel className="relative m-0 p-0 font-medium text-sm py-2 px-11 cursor-pointer">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <p className="text-[16px] font-light">
                      The sum total of past financing, including angel or
                      venture capital, loans, grants, or token sales.
                    </p>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companysRunaway"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormLabel className="text-[18px] font-semibold md:font-medium">
                    How would you characterize you company's
                    <br className="hidden md:flex" /> runway {"(in months)"}?
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex flex-col md:flex-row md:items-center gap-y-2 md:gap-20   ">
                      <div className="space-y-2">
                        <Input
                          type="number"
                          className="mb-6 rounded-[8px] border-[#ADB9C9] border-2 w-[280px] md:w-[390px] h-[45px] text-[#363636] focus:border-[#014367] focus:ring-[#014367] focus:ring-opacity-50"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FormMessage className="text-red-500" />
                      </div>

                      <p className="text-[16px] font-light">
                        Runway is calculated as current cash on hand devided by
                        <br className="hidden md:flex" /> monthly burn..
                        {"(i.e. a company that has 500,000 cash-on-"}
                        <br className="hidden md:flex" />
                        {
                          "hand, and net loss of $100,000 per month, has runway of five months.)"
                        }
                      </p>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="py-8 md:py-8 flex md:ms-[201px] justify-center md:justify-start">
            <Button
              disabled={isSubmitted}
              className="flex justify-center text-[14px] py-0 md:py-2 px-0 md:text-[18px] w-[200px] md:w-[390px] h-[60px] font-semibold md:font-bold bg-[#014367] text-white rounded-[8px] hover:bg-[#023450]"
              type="submit"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
