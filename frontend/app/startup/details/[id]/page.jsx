"use client";

import Details from "@/app/CustomComponents/pdp/pdp";
import { Api } from "@/shared/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pdp() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          const response = await Api.client.getStartup(id);
          setDetails(response);
        } catch (error) {
          console.error("Failed to fetch details:", error);
        }
      };

      fetchDetails();
    }
  }, [id]);
  console.log(details);
  return <Details details={details} />;
}
