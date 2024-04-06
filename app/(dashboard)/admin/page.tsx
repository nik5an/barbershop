import MyNavbar from "@/components/MyNavbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.email === "asd@gmail.com") {
    return (
      <div>
        <MyNavbar />
        <h2 className="text-2xl flex justify-center items-center h-screen">
          Admin page - welcome, {session?.user.fname}
        </h2>
      </div>
    );
  }
  return (
    <div>
      <MyNavbar />
      <h2 className="text-2xl flex justify-center items-center h-screen">
        You don&apos;t have access to this page. Please return back.
      </h2>
    </div>
  );
};

export default AdminPage;
