import React from "react";
import MyNavbar from "@/components/myNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const myBooking = () => {
  return (
    <>
      <MyNavbar />
      <div className="px-4 sm:px-10 mt-10">
        <h2 className="font-bold text-2xl">My Booking</h2>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="upcoming">Предстоящи</TabsTrigger>
            <TabsTrigger value="expired">Минали</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            your upcoming bookings are here.
          </TabsContent>
          <TabsContent value="expired">
            your expired bookings are here.
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default myBooking;
