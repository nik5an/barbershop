import MyNavbar from "@/app/components/MyNavbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return (
      <div>
        <MyNavbar />
        <h2 className="text-2xl flex justify-center items-center h-screen">
          Admin page - welcome, {session?.user.username}
        </h2>
      </div>
    );
  }
  return (
    <div>
      <MyNavbar />
      <h2 className="text-2xl flex justify-center items-center h-screen">
        Please login to see this admin page
      </h2>
    </div>
  );
};

export default page;
