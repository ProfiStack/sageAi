

import { mockPageData } from "@/mockData/homeMockData";
import CategoryCard from "./categoryCard/CategoryCard";
import Image from "next/image";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
 
const SectionHeader = ({ title }) => (
  <h2 className="text-lg font-bold text-gray-900 mb-4 px-4">
    {title}
  </h2>
);

export default function HomePage() {
  const router = useRouter();
  const data = mockPageData 
  
   
      const handleCategoryClick = (item) => {
        router.push(item.route);
      };
    
      return (
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-md mx-auto bg-white min-h-screen">
            <div className="relative w-[78px] h-[78px] mx-auto">
              <Image src={"/images/sagelogo2.png"} alt="sage" objectFit="contain" layout="fill" />
            </div>
            <p className="text-2xl font-bold text-center">Welcome to SageeAi</p>
            {/* Main Section */}
            <div className="pt-6 pb-4">
              <SectionHeader title="Main" />
              <div className="px-4 space-y-3">
                {data.main.map((item) => (
                  <CategoryCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </div>
    
            {/* Insights Section */}
            <div className="py-4">
              <SectionHeader title="Insights" />
              <div className="px-4 space-y-3">
                {data.insights.map((item) => (
                  <CategoryCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </div>
    
            {/* Professional Section */}
            <div className="py-4">
              <SectionHeader title="Professional" />
              <div className="px-4 space-y-3">
                {data.professional.map((item) => (
                  <CategoryCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </div>
    
            {/* Other Categories Section */}
            <div className="py-4 pb-8">
              <SectionHeader title="Other Categories" />
              <div className="px-4 space-y-3">
                {data.otherCategories.map((item) => (
                  <CategoryCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      );
    }
  
