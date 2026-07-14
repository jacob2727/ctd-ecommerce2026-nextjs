"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const useUserData = (sessionId?: string) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) {
        return;
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

  return userData;
};

export default useUserData;
