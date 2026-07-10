"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const useUserData = (sessionId: { sessionId: String }) => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) {
        return { userData: null };
      }
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/find-retailer`,
          {
            userId: sessionId,
          },
        );

        setUserData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [sessionId]);

  return { userData };
};
export default useUserData;
