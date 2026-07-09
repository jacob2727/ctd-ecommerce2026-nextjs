import { auth0 } from "@/lib/auth0";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { redirect } from "next/navigation";

const RetailerDashboard = async () => {
  const session = (await auth0.getSession())?.user?.sub;

  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, {
    userId: session,
  });
  if (!response.data) {
    redirect("/start");
  }

  return <main></main>;
};

export default RetailerDashboard