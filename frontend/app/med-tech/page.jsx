'use client'

import CategoryPage from "@/CustomComponents/home/categoryCard/CategoryPage";
import { medtechData } from "@/mockData/homeMockData";

export default function MedTech() {
  return (
    <CategoryPage
      title="Med-Tech"
      pageData={medtechData}
      popupCategories={["MedTech"]}  // no popup categories for Med-Tech; adjust as needed
    />
  );
}