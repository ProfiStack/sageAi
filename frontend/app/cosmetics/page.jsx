'use client'

import CategoryPage from "@/CustomComponents/home/categoryCard/CategoryPage";
import { cosmeticsItemsData } from "@/mockData/homeMockData";

export default function Cosmetics() {
  return (
    <CategoryPage
      title="Cosmetics"
      pageData={cosmeticsItemsData}
      popupCategories={["Makeup"]}
    />
  );
}