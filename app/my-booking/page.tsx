"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState, useEffect } from "react";
import MyNavbar from "@/components/MyNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CiClock1 } from "react-icons/ci";
import { CiStickyNote } from "react-icons/ci";
import { MdOutlineCalendarMonth } from "react-icons/md";

const MyBooking = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [expiredBookings, setExpiredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDate = (datetimeString: string) => {
    const dateTime = new Date(datetimeString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dateTime.toLocaleString("bg-BG", options);
  };
  const formatTime = (datetimeString: string) => {
    const dateTime = new Date(datetimeString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    return dateTime.toLocaleString("bg-BG", options);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const upcomingResponse = await fetch(
          `/api/appointment/upcomingBookings`,
          {
            method: "GET",
          }
        );
        if (!upcomingResponse.ok) {
          throw new Error("Failed to fetch upcoming bookings.");
        }
        const upcomingData = await upcomingResponse.json();
        setUpcomingBookings(upcomingData);

        const expiredResponse = await fetch(
          `/api/appointment/expiredBookings`,
          {
            method: "GET",
          }
        );
        if (!expiredResponse.ok) {
          throw new Error("Failed to fetch expired bookings.");
        }
        const expiredData = await expiredResponse.json();
        setExpiredBookings(expiredData);

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/appointment/deleteBooking`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: bookingId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
      setUpcomingBookings(
        upcomingBookings.filter((item) => item.id !== bookingId)
      );
      toast({
        title: "Success",
        description: "Вие успешно изтрихте часа си.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-neutral">
        <MyNavbar />
      </div>
      <div className="px-4 sm:px-10 mt-10 h-screen">
        <h2 className="font-bold text-2xl">Моите часове</h2>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="upcoming">Предстоящи</TabsTrigger>
            <TabsTrigger value="expired">Минали</TabsTrigger>
          </TabsList>
          {loading ? (
            <p>Зареждане...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <TabsContent
                value="upcoming"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
              >
                {upcomingBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center border p-3 rounded-lg"
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-center">
                        <h2 className="flex gap-2 text-lg">
                          <MdOutlineCalendarMonth className="text-2xl" />
                          {formatDate(booking.datetime)}
                        </h2>
                        <AlertDialog>
                          <AlertDialogTrigger className="justify-end border rounded-lg p-2 bg-red-500 hover:bg-red-700">
                            Изтрий часа
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-medium">
                                Сигурни ли сте
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-normal">
                                Това ще изтрие вашия час за винаги.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Затвори</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBooking(booking.id)}
                              >
                                Продължи
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <h2 className="flex gap-2 text-lg">
                        <CiClock1 className="text-2xl" />
                        {formatTime(booking.datetime)}
                      </h2>
                      {booking.note && (
                        <h2 className="flex gap-2 text-lg">
                          <CiStickyNote className="text-2xl" />
                          {booking.note}
                        </h2>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent
                value="expired"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
              >
                {expiredBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center border p-3 rounded-lg"
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <h2 className="flex gap-2 text-lg">
                        <MdOutlineCalendarMonth className="text-2xl" />
                        {formatDate(booking.datetime)}
                      </h2>
                      <h2 className="flex gap-2 text-lg">
                        <CiClock1 className="text-2xl" />
                        {formatTime(booking.datetime)}
                      </h2>
                      {booking.note && (
                        <h2 className="flex gap-2 text-lg">
                          <CiStickyNote className="text-2xl" />
                          {booking.note}
                        </h2>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default MyBooking;
