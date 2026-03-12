'use client'

import CategoryPage from "@/CustomComponents/home/categoryCard/CategoryPage";
import { healthItemsData } from "@/mockData/homeMockData";

export default function Health() {
  return (
    <CategoryPage
      title="Health"
      pageData={healthItemsData}
      popupCategories={["Skincare"]}
    />
  );
}