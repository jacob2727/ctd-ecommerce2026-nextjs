import { auth0 } from "@/lib/auth0";
import axios from "axios";
import { redirect } from "next/navigation";

const TestApiCheckUser = async () => {
  const session = (await auth0.getSession())?.user?.sub;
  let isRetailer = false;
  if (session === null) {
    redirect("/start");
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/retailerdashboard",
      {
        userId: session,
      },
    );

    isRetailer = response.data["retailer"];
    if (!isRetailer) {
      redirect("/start");
    }
    return (
      <div>
        <h1>API Response</h1>
        <pre>{JSON.stringify(isRetailer, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error("Error checking user:", error);
  }
};

export default TestApiCheckUser;
