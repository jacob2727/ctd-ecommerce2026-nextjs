import axios from "axios";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

const StartTORetailer = async () => {
  const session = await auth0.getSession();

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/retailers/create`,
    {
      name: session?.user.name,
      userId: session?.user.sub,
    },
  );

  const data = response.data;

  redirect(`${data.url}`);

  return <main></main>;
};

export default StartTORetailer;
