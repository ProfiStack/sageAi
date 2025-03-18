export default function StayInformed() {
  return (
    <div className="py-16  md:pt-40 mx-2 md:mx-0  md:pb-32 flex flex-col items-center  ">
      <div className="text-center">
        <p className="text-[26px] md:text-[36px] font-bold mb-3">
          Stay Informed and Engaged
        </p>
        <p className="text-center w-auto md:w-[653px] text-[18px] font-[400px] mb-2 text-[#545B79]">
          Subscribe for the latest updates on our startups and investment
          opportunities. Keep up with Naimaat and connect with our vibrant
          community.
        </p>
      </div>
      <div className="flex border-2 border-[#C3C5CE] w-auto gap-x-0 px-1 md:gap-x-[10px] md:px-[7px] py-[5px] rounded-[8px]">
        <input
          className=" pe-5 md:pe-28 focus:outline-none  "
          type="email"
          placeholder="Enter Your Email"
        />
        <button className="px-6 py-[7px] bg-[#14315D] rounded-[10px] text-white text-[16px] font-bold">
          Subscribe
        </button>
      </div>
    </div>
  );
}
