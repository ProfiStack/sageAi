
'use client'
import Image from 'next/image';
import Countdown from 'react-countdown';
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
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { Api } from '@/shared/api/api';

const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    name: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    password: z.string().min(5, {
      message: "Password must be at least 5 characters.",
    }),
    phone: z.string().min(6, { message: "Mobile number must be at least 6 digits." }).regex(/^\d+$/, { message: "Mobile number must contain only numbers." }),
  });
  const splitDigits = (number) => {
    const digits = String(number).padStart(2, '0'); // Ensure two digits (e.g., 3 -> '03')
    return digits.split('');
  };
  const renderer = ({ days, hours, minutes, completed }) => {
    if (completed) {
      // Render something when the countdown is completed
      return <span>Countdown Finished!</span>;
    } else {
        const [dayTens, dayOnes] = splitDigits(days);
        const [hourTens, hourOnes] = splitDigits(hours);
        const [minuteTens, minuteOnes] = splitDigits(minutes);
      // Render the countdown
      return (
        <div className='flex flex-col items-center pb-10 '>
            <div>
                <p className='text-[30px] md:text-[50px] font-bold pb-3 md:pb-5'>LIVE IN</p>
            </div>
            <div className='flex items-center gap-2 md:gap-10   '>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2 md:gap-10 h-[41px] md:h-auto'>
                        <div className='flex items-center gap-2 md:gap-4'>
          <span className='text-white bg-black px-4 py-2 md:px-8 md:py-4 text-[15px] md:text-[30px] font-bold border rounded-[8px] md:rounded-xl h-min  '>{dayTens}  </span>
          <span className='text-white bg-black px-4 py-2 md:px-8 md:py-4 text-[15px] md:text-[30px] font-bold border rounded-[8px] md:rounded-xl h-auto  '>{dayOnes}  </span>
          </div>
          <p className='text-[40px] font-extrabold '>:</p>
          </div>
          <p className=' flex justify-center text-[20px] md:text-[40px] font-bold md:font-extrabold'>Days</p>
          </div>
          <div className='flex flex-col '>
            <div className='flex items-center gap-2 md:gap-10 h-[41px] md:h-auto'>
                <div className='flex items-center gap-2 md:gap-4 '>
          <span className='text-white bg-black px-4 py-2 md:px-8 md:py-4 text-[15px] md:text-[30px] font-bold border rounded-[8px] md:rounded-xl h-auto  '>{hourTens} </span>
          <span className='text-white bg-black px-4 py-2 md:px-8 md:py-4 text-[15px] md:text-[30px] font-bold border rounded-[8px] md:rounded-xl h-auto   '>{hourOnes} </span>
          </div>
          <p  className='text-[40px] font-extrabold '>:</p>
          </div>
          <p className=' flex justify-center text-[20px] md:text-[40px] font-bold md:font-extrabold'>Hours</p>

          </div>
          <div className='flex flex-col '>
            <div>
                <div className='flex items-center gap-2 md:gap-4'>
          <span className='text-white bg-black px-4 py-2 md:px-8 md:py-4 text-[15px] md:text-[30px] font-bold border rounded-[8px] md:rounded-xl h-auto '>{minuteTens} </span>
          <span className='text-white bg-black px-4 py-2 md:px-8 md:py-4 text-[15px] md:text-[30px] font-bold border rounded-[8px] md:rounded-xl h-auto '>{minuteOnes} </span>
          </div>

          </div>
          <div>
          <p className='flex justify-center text-[20px] md:text-[40px] font-bold md:font-extrabold'>Minutes</p>
          </div>

          </div>
          
          
          </div>
        </div>
      );
    }
  };
export default function Invite(){
  const router = useRouter()
    const form = useFormHook({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          name: "",
          phone: "",
          password: '',
        },
      });
      async function onSubmit(values) {
        const data  = await Api.client.signUp(values);
        router.push('/thankyou')
        console.log(values);
      }
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      
    return (
        <div className='p-1 md:p-5 bg-[#F7F7F8] overflow-x-hidden h-screen  '>
            <div className='flex justify-center'>
            <div className=' relative w-[100px] h-[100px]  md:w-[150px] md:h-[100px]  '>
        <Image src={'/images/logo.png'} alt="logo" objectFit='contain' layout='fill'/>
            </div>
            </div>
            <div className=''>
                <div className='relative flex  justify-center  '>
                <div>
                <p className='text-[15px] md:text-[30px] font-semibold md:font-bold text-[#014367] text-center pt-5 md:pt-10'>Creating Opportunities,Empowering Ambitions</p>
                <p className='text-[12px] md:text-[26px] font-bold text-center pt-2 md:pt-5'>Something extraordinary is brewing! </p>
                </div>
                <div className='absolute translate-x-[168px] translate-y-[15px]  md:translate-x-[380px] md:-translate-y-[40px]   '>
                <div className=' h-[40px] w-[40px] md:h-[200px] md:w-[200px]' >
                    <Image src={'/images/selfConfidence.png'} objectFit='contain' layout='fill' alt="image"/>
                </div>
                </div>
                </div>
                <div className='flex justify-center leading-tight pt-5 pb-2 md:pt-10 md:pb-5'>
                <p className='text-[12px] md:text-[26px] font-bold  text-[#014367] w-auto md:w-[607px] text-center md:text-start'>Discover how we’re transforming aspirations into success be among the first to experience it!</p>
                </div>
                <div className='leading-tight pt-2 md:pt-5 pb-2 md:pb-5'>
                <p className='text-center text-[12px] md:text-[26px] font-bold'>Join a community that’s turning </p>
                <p className='text-center text-[12px] md:text-[26px] font-bold'>dreams into reality </p>
                </div>
            </div>
            <div>
            <div className="flex md:justify-center  md:gap-20 pb-2 md:pb-5 bg-[#F7F7F8] flex-col items-center md:flex-row md-h-auto h-auto" >
      <div className=' relative w-[80px] h-[80px] md:w-[120px] md:h-[120px] '>
        <Image
          src={'/images/rocket.png'}
          objectFit='contain'
          layout='fill'
          alt="image"
          className=" -translate-x-[120px] -translate-y-3  md:-translate-x-10   "
        />
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-[8px] border-[#C3C5CE] pr-32 text-[#ADB9C9] bg-white"
                        type='email'
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className='text-red-500' />
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
                        className="rounded-[8px] border-[#C3C5CE] pr-32 text-[#ADB9C9] bg-white"
                        placeholder="Password"
                        {...field}
                        type='password'
                      />
                    </FormControl>

                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-[8px] border-[#C3C5CE] pr-32 text-[#ADB9C9] bg-white"
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />{" "}
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-[8px] border-[#C3C5CE] pr-32 text-[#ADB9C9] bg-white"
                        placeholder="Number"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className={cn(
                "flex justify-center text-[18px] font-medium py-[9px] bg-[#014367] text-white rounded-[10px] mb-8 hover:bg-[#014367] px-[10px]  "
              )}
              type="submit"
            >
              Claim your spot now
            </Button>
          </form>
        </Form>
      </div>
      <div className='relative w-[80px] h-[80px] md:h-[120px] md:w-[120px]'>
        <Image
          src={'/images/piggybank.png'}
          alt="image"
          width={110}
          height={110}
          className=" translate-x-[130px] translate-y-3 md:translate-x-5   md:-translate-y-14"
        />
      </div>
    </div>
            </div>
            <div>
            <Countdown
      date={Date.now() + thirtyDaysInMs}
      renderer={renderer} // Custom renderer function
    />
    </div>
        </div>
    )
}