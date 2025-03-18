"use client";

import Image from "next/image";
import Footer from "../../CustomComponents/Footer/Footer";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/app/CustomComponents/header/Header";
import CompletionBar from "../completionBar/CompletionBar";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/shared/utils/utils";

export default function Details({ details }) {
  const [authToken, setAuthToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getAuth = async () => {
      const authToken = await getAuthToken();
      setAuthToken(authToken);
    };
    getAuth();
  });
  const handleOnClick = () => {
    if (!authToken) {
      router.push("/login");
    } else {
      router.push("/invest");
    }
  };
  const raisedPercentage =
    (details?.moneyRaised / details?.moneyToBeRaised) * 100;
  if (!details)
    return (
      <p className="w-full h-screen flex justify-center items-center font-bold text-[100px]">
        Loading...
      </p>
    );
  return (
    <div className="mx-4 md:overflow-x-auto md:container md:mx-auto">
      <Header />
      <div className="md:my-12">
        <div className="flex items-center gap-[20px]">
          <Image
            src={details?.logo}
            alt="Logo"
            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-[20px]"
            width={100}
            height={100}
          />
          <h1 className="text-[28px] md:text-[40px] font-semibold text-[#1D1B20]">
            {details?.companyName}
          </h1>
        </div>
        <p className="my-3 text-[#00000099] text-[14px] md:text-[20px] me-4 md:me-0 md:w-[40%]">
          {details?.description}
        </p>
      </div>
      <div className="my-6 md:my-12 md:grid md:grid-cols-3 gap-[20px]">
        <div className="col-span-2">
          <div className="relative w-full h-[205px] md:h-[410px] rounded-t-[20px] overflow-hidden">
            <Image src={details?.titleImage} layout="fill" objectFit="fill" />
          </div>
          <div className="shadow-md justify-between flex items-center gap-[20px] p-5 rounded-b-[20px] drop-shadow-sm">
            <div className="flex gap-4 justify-center items-center">
              <i className="fas fa-map-marker-alt text-[#00000099] text-[20px]"></i>
              <p className="text-[#00000099]">Dubai, UAE</p>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center rounded-[4px] p-1 bg-[#EEF4DF] uppercase text-[#00000099]">
                {details?.industry}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 my-4 md:my-0 md:px-16">
          <p className="md:mx-4 text-[28px] md:text-[36px] font-bold">
            AED {details?.moneyRaised.toLocaleString()}
          </p>
          <p className="md:mx-4 text-[#00000099] text-[14px] md:text-[18px]">
            {raisedPercentage.toFixed(0)}% raised of 100,000 funding goal
          </p>
          <div className="flex justify-between font-base text-sm text-[#777777] pb-1 my-2">
            <p className="text-[#34C759CC] bg-[#def7e5] rounded-[15px] px-[6px]   ">
              {raisedPercentage.toFixed(0)}%{" "}
            </p>
            <p>${details?.moneyRaised.toLocaleString()} raised</p>
          </div>
          <CompletionBar
            completionPercentage={raisedPercentage}
            className="h-[10px]"
          />
          <p className="mt-2 md:my-0 md:mx-4 text-[28px] md:text-[36px] font-bold">
            20 Days
          </p>
          <p className="md:mx-4 text-[#00000099] font-medium text-[14px] md:text-[18px]">
            Left to invest
          </p>
          <div className="my-4 border-b-2 border-[#00000020]"></div>

          <button
            onClick={() => handleOnClick()}
            className="w-full bg-[#014367] text-white p-4 rounded-[10px] mt-12 hover:bg-[#023450] transition-all duration-300 ease-in-out"
          >
            Invest in Fantacylcling
          </button>
          <p className="text-[#00000099] text-[15px] mt-2 text-center">
            minimum investment AED 1000
          </p>
        </div>
        {/* Tabs (Overview, Updates, Reviews, Discussion) */}
        <div className="col-span-3 md:mt-12">
          <Tabs defaultValue="overview" className="">
            <TabsList className="grid grid-cols-2 md:inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none md:border-b bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="mb-2 md:mb-0 inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none transition-all duration-300 ease-in-out"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none transition-all duration-300 ease-in-out"
              >
                Updates
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none transition-all duration-300 ease-in-out"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none transition-all duration-300 ease-in-out"
              >
                Discussion
              </TabsTrigger>
            </TabsList>

            <TabsContent className="my-12 md:my-6" value="overview">
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Highlights
              </h1>
              <ul className="my-4 mx-4 text-[14px] md:text-[18px] text-[#1A202C] list-disc ">
                <li className="my-2">
                  A football ground encourages regular exercise, improving
                  health and fitness in the community.
                </li>
                <li className="my-4">
                  It provides a space for young people to stay active, develop
                  skills, and practice teamwork.
                </li>
                <li className="my-4">
                  It fosters a sense of community, bringing people together
                  through sports and social interaction.
                </li>
                <li className="my-4">
                  The ground can help discover and nurture local football talent
                  by offering a place to practice and improve.
                </li>
                <li className="my-4">
                  Renting out the football ground for matches, tournaments, or
                  events can generate consistent revenue, making it a
                  financially sustainable project.
                </li>
                <li className="my-4">
                  You can organize events, leagues, and competitions, attracting
                  local sponsors and creating additional revenue streams.
                </li>
              </ul>
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Project
              </h1>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                The Community Football Ground Development project aims to
                construct a dedicated football facility that serves as a hub for
                sports, health, and community engagement. This initiative
                addresses the current lack of designated space for football in
                the community, providing a venue where individuals of all ages
                can participate in regular exercise, develop their skills, and
                foster teamwork.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                The project has several key objectives. Firstly, it seeks to
                create a safe and accessible space that encourages participation
                from diverse groups within the community. Secondly, the
                development aims to promote physical health and fitness by
                facilitating regular exercise opportunities, thereby improving
                the overall health and fitness levels of residents through
                organized activities and events. Additionally, the project
                focuses on nurturing local talent by providing training
                facilities and programs for young athletes to develop their
                football skills and pursue their passion for the sport.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                The project has several key objectives. Firstly, it seeks to
                create a safe and accessible space that encourages participation
                from diverse groups within the community. Secondly, the
                development aims to promote physical health and fitness by
                facilitating regular exercise opportunities, thereby improving
                the overall health and fitness levels of residents through
                organized activities and events. Additionally, the project
                focuses on nurturing local talent by providing training
                facilities and programs for young athletes to develop their
                football skills and pursue their passion for the sport.
              </p>
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Problem Statement
              </h1>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                The community currently lacks a designated football ground,
                which limits opportunities for regular exercise, health
                improvement, and physical fitness. Without a dedicated space,
                young people are deprived of an environment where they can stay
                active, develop their football skills, and practice teamwork.
                This absence also makes it difficult to discover and nurture
                local football talent, leaving potential players without a place
                to train and improve.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Furthermore, the lack of a football ground prevents the
                community from benefiting financially. Renting the ground for
                matches, tournaments, and events could provide consistent
                revenue and foster local economic growth. Without this space,
                the area misses out on the chance to attract local sponsors,
                organize leagues and competitions, and boost investment in the
                region's infrastructure, all of which could enhance the local
                economy and bring the community together
              </p>
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Problem Solution
              </h1>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Building a football ground will provide a dedicated space for
                regular exercise, improving community health and fitness. It
                will offer young people an environment to develop their skills,
                practice teamwork, and nurture local talent. Additionally, the
                football ground can generate consistent revenue by renting it
                out for matches, tournaments, and events.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Organizing leagues and competitions can attract local sponsors
                and create new revenue streams. This project will also improve
                local infrastructure, attracting further investments and
                increasing the area’s economic growth by drawing visitors and
                fostering community engagement through sports.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                By creating a central hub for sports and social interaction, the
                football ground will foster a stronger sense of community,
                bringing together people of all ages and backgrounds. It can
                serve as a venue not only for football but for other events like
                community gatherings, fitness classes, and local festivals,
                further enhancing its value to the community.
              </p>
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Why we think it will work?
              </h1>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                We believe that the establishment of a dedicated football ground
                will be successful due to several compelling factors. First,
                there is a significant demand for community spaces that promote
                physical activity, particularly among youth who are seeking
                constructive outlets for their energy and talent.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                By providing a high-quality facility designed for football, we
                can facilitate regular practice and competitive play, fostering
                skill development and teamwork. Additionally, the football
                ground will serve as a hub for local events, tournaments, and
                leagues, attracting participants and spectators alike, which
                will drive community engagement and support.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Overall, the combination of community need, engagement
                opportunities, and revenue potential positions this football
                ground as a valuable asset for the area, enhancing both the
                local sports culture and overall quality of life.
              </p>
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Revenue Generation
              </h1>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                We believe that the establishment of a dedicated football ground
                will be successful due to several compelling factors. First,
                there is a significant demand for community spaces that promote
                physical activity, particularly among youth who are seeking
                constructive outlets for their energy and talent.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                By providing a high-quality facility designed for football, we
                can facilitate regular practice and competitive play, fostering
                skill development and teamwork. Additionally, the football
                ground will serve as a hub for local events, tournaments, and
                leagues, attracting participants and spectators alike, which
                will drive community engagement and support.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Overall, the combination of community need, engagement
                opportunities, and revenue potential positions this football
                ground as a valuable asset for the area, enhancing both the
                local sports culture and overall quality of life.
              </p>
              <h1 className="text-[#014367] text-[24px] md:text-[32px] font-medium">
                Pricing Strategy
              </h1>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Equity Shares: Offer investors the opportunity to buy equity in
                the project, providing them with ownership stakes in the
                football ground. The percentage of equity will depend on the
                amount invested, with clear terms outlined in the investment
                agreement. Tiered Investment Levels: Create different tiers of
                investment that offer varying levels of equity and benefits,
                encouraging larger investments by offering greater ownership
                stakes or additional perks for higher tiers.
              </p>
              <p className="my-4 text-[14px] md:text-[18px] text-[#1A202C]">
                Clear ROI Models: Provide potential investors with detailed
                financial projections that outline expected returns over time.
                Highlight the timeline for returns, including the anticipated
                profit distributions starting within two years after project
                completion. Revenue Sharing: Outline how profits will be
                distributed among investors based on their equity stakes. For
                example, investors might receive a percentage of net profits
                after covering operational costs and reinvestment needs.
              </p>
              <div className="rounded-[20px] my-10 p-5 bg-[#F7F7F7]">
                <h1 className="mx-4 mb-8 text-[#014367] text-[22px] md:text-[34px] font-medium">
                  Our Team
                </h1>
                <div className="flex my-4 mx-8 items-center gap-4">
                  <Avatar className="bg-[#EEF4DF] p-2 rounded-full w-10 h-10 md:w-20 md:h-20">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <i className="fas fa-user text-[18px] md:text-[24px]"></i>
                    </AvatarFallback>
                  </Avatar>
                  <h1>
                    <p
                      className="text-[#000000] text-[16px] md:text-[20px] 
                    font-semibold"
                    >
                      John Doe
                    </p>
                    <p className="text-[#00000099] text-[12px] md:text-[16px]">
                      CEO
                    </p>
                    <p className="text-[#00000099] text-[10px] md:text-[12px]">
                      CEO and founder of this project.
                    </p>
                  </h1>
                </div>
                <div className="flex my-4 mx-8 items-center gap-4">
                  <Avatar className="bg-[#EEF4DF] p-2 rounded-full w-10 h-10 md:w-20 md:h-20">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <i className="fas fa-user text-[18px] md:text-[24px]"></i>
                    </AvatarFallback>
                  </Avatar>
                  <h1>
                    <p
                      className="text-[#000000] text-[16px] md:text-[20px] 
                    font-semibold"
                    >
                      Paresh Patel
                    </p>
                    <p className="text-[#00000099] text-[12px] md:text-[16px]">
                      Co- Founder{" "}
                    </p>
                    <p className="text-[#00000099] text-[10px] md:text-[12px]">
                      Administrator with experience in ICC World Cup
                    </p>
                  </h1>
                </div>
                <div className="flex my-4 mx-8 items-center gap-4">
                  <Avatar className="bg-[#EEF4DF] p-2 rounded-full w-10 h-10 md:w-20 md:h-20">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <i className="fas fa-user text-[18px] md:text-[24px]"></i>
                    </AvatarFallback>
                  </Avatar>
                  <h1>
                    <p
                      className="text-[#000000] text-[16px] md:text-[20px] 
                    font-semibold"
                    >
                      Ajay seth
                    </p>
                    <p className="text-[#00000099] text-[12px] md:text-[16px]">
                      Co- Founder{" "}
                    </p>
                    <p className="text-[#00000099] text-[10px] md:text-[12px]">
                      Administrator with experience in ICC World Cup. Current
                      football Coach with South Africa National Team
                    </p>
                  </h1>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="updates">
              <div className="rounded-[12px] my-14 p-4 md:p-10 border border-[#ECECEC] mx-auto md:w-[85%]">
                <h1 className="mx-4 md:mb-8 text-[20px] md:text-[34px] font-medium">
                  Updates on Project
                </h1>
                <p className="m-4 text-[14px] md:text-[18px]">
                  Rob Collins, Founder and CEO of Coign, shares how your
                  investment will help establish a community football club that
                  engages with local residents seeking an alternative to
                  traditional sports organizations. The project aims to create a
                  welcoming environment for all ages and skill levels, promoting
                  physical activity and social interaction
                  <a href="/" className="text-[#014367] font-medium">
                    {" "}
                    read more...
                  </a>
                </p>
                <div className="mx-4 my-8 flex items-center gap-4">
                  <Avatar className="bg-[#EEF4DF] p-2 rounded-full md:w-[50px] md:h-[50px]">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <i className="fas fa-user md:text-[24px]"></i>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="md:flex items-center gap-2">
                      <h1 className="text-[#000000] text-[14px] md:text-[20px] font-semibold">
                        John Doe
                      </h1>
                      <p className="text-[#00000099] text-[12px] md:text-[14px]">
                        on 16th Sept 2024
                      </p>
                    </div>
                    <p className="text-[#00000099] text-[10px] md:text-[12px]">
                      CEO and founder of this project.
                    </p>
                  </div>
                </div>
                <div className="mx-4 border-b-2 border-[#00000020] "></div>
                <div className="mx-4 flex items-center gap-10 my-4">
                  <div
                    className="flex items-center gap-2 my-4 cursor-pointer"
                    as="button"
                  >
                    <i className="fas fa-heart text-[#F80E0E] text-[14px] md:text-[20px]"></i>
                    <p className="text-[#F80E0E] text-[14px] md:text-[20px]">
                      Like
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 my-4 cursor-pointer"
                    as="button"
                  >
                    <i className="fas fa-comment text-[#124074] text-[14px] md:text-[20px]"></i>
                    <p className="text-[#124074] text-[14px] md:text-[20px]">
                      Comment
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="rounded-[12px] my-14 p-4 md:p-10 border border-[#ECECEC] mx-auto md:w-[85%]">
                <h1 className="md:mx-4 mx-2 md:mb-8 text-[20px] md:text-[34px] font-medium">
                  What people are saying?
                </h1>
                <div>
                  <div className="mx-4 mt-8 flex items-center gap-4">
                    <Avatar className="bg-[#EEF4DF] p-2 rounded-full md:w-[50px] md:h-[50px]">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <i className="fas fa-user md:text-[24px]"></i>
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="md:flex items-center gap-2">
                        <h1 className="text-[#000000] text-[12px] md:text-[20px] font-semibold">
                          Naveed
                        </h1>
                        <p className="text-[#00000099] text-[12px] md:text-[14px]">
                          on 19th Sept 2024
                        </p>
                      </div>
                      <p className="text-[#00000099] text-[10px] md:text-[12px] border border-[#00000020] p-1 rounded-[8px] w-[70px] text-center">
                        Investor
                      </p>
                    </div>
                  </div>
                  <p className="text-[#000000] text-[14px] md:text-[18px] mx-4 md:mx-20 my-4">
                    I'm excited to invest in this football project, as it will
                    engage the community and encourage a healthier lifestyle.
                    This initiative truly embodies the spirit of sports and
                    well-being.
                  </p>
                </div>
                <div>
                  <div className="mx-4 border-b-2 border-[#00000020] "></div>
                  <div className="mx-4 mt-8 flex items-center gap-4">
                    <Avatar className="bg-[#EEF4DF] p-2 rounded-full md:w-[50px] md:h-[50px]">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <i className="fas fa-user md:text-[24px]"></i>
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="md:flex items-center gap-2">
                        <h1 className="text-[#000000] text-[12px] md:text-[20px] font-semibold">
                          Kamran
                        </h1>
                        <p className="text-[#00000099] text-[12px] md:text-[14px]">
                          on 22th Sept 2024
                        </p>
                      </div>
                      <p className="text-[#00000099]  text-[10px] md:text-[12px] border border-[#00000020] p-1 rounded-[8px] w-[70px] text-center">
                        Investor
                      </p>
                    </div>
                  </div>
                  <p className="text-[#000000] text-[14px] md:text-[18px] mx-4 md:mx-20 my-4">
                    I'm excited to invest in this football project, as it will
                    engage the community and encourage a healthier lifestyle.
                    This initiative truly embodies the spirit of sports and
                    well-being.
                  </p>
                </div>
                <div className="mx-4 border-b-2 border-[#00000020] "></div>
                <div>
                  <div className="mx-4 mt-8 flex items-center gap-4">
                    <Avatar className="bg-[#EEF4DF] p-2 rounded-full md:w-[50px] md:h-[50px]">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <i className="fas fa-user md:text-[24px]"></i>
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="md:flex items-center gap-2">
                        <h1 className="text-[#000000] text-[12px] md:text-[20px] font-semibold">
                          Naveed
                        </h1>
                        <p className="text-[#00000099] text-[12px] md:text-[14px]">
                          on 19th Sept 2024
                        </p>
                      </div>
                      <p className="text-[#00000099] text-[10px] md:text-[12px] border border-[#00000020] p-1 rounded-[8px] w-[70px] text-center">
                        Investor
                      </p>
                    </div>
                  </div>
                  <p className="text-[#000000] text-[14px] md:text-[18px] mx-4 md:mx-20 my-4">
                    I'm excited to invest in this football project, as it will
                    engage the community and encourage a healthier lifestyle.
                    This initiative truly embodies the spirit of sports and
                    well-being.
                  </p>
                </div>
                <div className="mx-4 border-b-2 border-[#00000020] "></div>
              </div>
            </TabsContent>
            <TabsContent value="discussion">
              <div className="rounded-[12px] mt-14 md:p-10 p-4 border border-[#ECECEC] mx-auto md:w-[85%]">
                <h1 className="mx-4 text-[20px] md:text-[34px] font-medium text-center">
                  Discussion
                </h1>
                <p className="mx-4 text-[12px] md:text-[18px] text-[#1A202C] text-center">
                  Ask questions and share feedback with the team below.
                </p>

                <div className="mx-4 mt-8 mb-4 flex items-center gap-4">
                  <Avatar className="bg-[#EEF4DF] p-2 rounded-full md:w-[50px] md:h-[50px]">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <i className="fas fa-user md:text-[24px]"></i>
                    </AvatarFallback>
                  </Avatar>
                  <textarea
                    placeholder="Write a comment"
                    className="w-full p-2 md:p-4 border border-[#ECECEC] rounded-[10px]"
                  />
                </div>
                <button className="mx-20 bg-[#014367] text-white px-6 md:py-3 py-2 rounded-[18px] hover:bg-[#023450] transition-all duration-300 ease-in-out">
                  Post
                </button>
              </div>

              <div className="rounded-[12px] my-4 md:my-10 md:p-10 p-4 border border-[#ECECEC] mx-auto md:w-[85%]">
                <div className="mx-4 flex items-center gap-4">
                  <Avatar className="bg-[#EEF4DF] p-2 rounded-full md:w-[50px] md:h-[50px]">
                    <AvatarImage src="" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="md:flex items-center gap-2">
                      <h1 className="text-[#000000] md:text-[20px] font-semibold">
                        John Doe
                      </h1>
                      <p className="text-[#00000099] text-[14px]">
                        on 16th Sept 2024
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[#000000] text-[14px] md:text-[18px] mx-4 md:mx-20 my-4">
                  How and when will the Groundfloor account credit be applied if
                  I invest $2500 in class shares. Does my Groundfloor account
                  email shares. Does my Groundfloor account email and my
                  republic email need to be the same?
                </p>
                <div className="mx-4 border-b-2 border-[#00000020] "></div>
                <div className="mx-4 flex items-center gap-10 my-4">
                  <div
                    className="flex items-center gap-2 my-4 cursor-pointer"
                    as="button"
                  >
                    <i className="fas fa-heart text-[#F80E0E] md:text-[20px]"></i>
                    <p className="text-[#F80E0E] md:text-[20px]">Like</p>
                  </div>
                  <div
                    className="flex items-center gap-2 my-4 cursor-pointer"
                    as="button"
                  >
                    <i className="fas fa-comment text-[#124074] md:text-[20px]"></i>
                    <p className="text-[#124074] md:text-[20px]">Reply</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
