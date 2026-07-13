import { auth0 } from "@/lib/auth0";
import axios from "axios";

const getRetailer = async () => {
  const session = (await auth0.getSession())?.user?.sub;

  try {
    const data = await axios.post(
      "http://localhost:8080/retailer-dashboard/find-retailer",
      {
        userId: session,
      },
    );
    console.log(data.data);
    return <div>{JSON.stringify(data.data)}</div>;
  } catch (e) {
    console.log(e);
  }
};

export default getRetailer;
