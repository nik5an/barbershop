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
import { useSession } from "next-auth/react";
import { IoPersonOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import EditModal from "@/components/editAppointment";

const AdminPage = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [bookingUsers, setBookingUsers] = useState<any[]>([]);
  const [bookingUsersExpired, setBookingUsersExpired] = useState<any[]>([]);
  const [expiredBookings, setExpiredBookings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const user = session?.user;

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
    const adminArray = ["1"];

    const fetchData = async () => {
      if (user && adminArray.includes(user.id)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/");
      }

      try {
        const upcomingResponse = await fetch(
          `/api/appointment/getAllUpcoming`,
          {
            method: "GET",
          }
        );
        if (!upcomingResponse.ok) {
          throw new Error("Failed to fetch upcoming bookings.");
        }
        const upcomingData = await upcomingResponse.json();
        setUpcomingBookings(upcomingData.upcomingBookings);
        setBookingUsers(upcomingData.bookingUsers);

        const expiredResponse = await fetch(`/api/appointment/getAllExpired`, {
          method: "GET",
        });
        if (!expiredResponse.ok) {
          throw new Error("Failed to fetch expired bookings.");
        }
        const expiredData = await expiredResponse.json();
        setExpiredBookings(expiredData.expiredBookings);
        setBookingUsersExpired(expiredData.bookingUsers);

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [router, user]);

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
      {isAdmin && (
        <div className="px-4 sm:px-10 mt-10">
          <h2 className="font-bold text-2xl">Всички часове</h2>
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
                <TabsContent value="upcoming">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {upcomingBookings.map((booking, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-center border p-3 rounded-lg"
                      >
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex justify-between items-center">
                            <h2 className="flex gap-2 text-lg">
                              <MdOutlineCalendarMonth className="text-2xl mt-1" />
                              {formatDate(booking.datetime)}
                            </h2>
                            <div className="flex flex-col ml-auto justify-end">
                              <AlertDialog>
                                <AlertDialogTrigger className="bg-red-500 justify-end border rounded-lg p-2 hover:bg-red-700">
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
                                    <AlertDialogCancel>
                                      Затвори
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteBooking(booking.id)}
                                    >
                                      Продължи
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <EditModal appointment={booking}></EditModal>
                            </div>
                          </div>
                          <h2 className="flex gap-2 text-lg">
                            <CiClock1 className="text-2xl mt-0.5" />
                            {formatTime(booking.datetime)}
                          </h2>
                          {booking.note && (
                            <h2 className="flex gap-2 text-lg">
                              <CiStickyNote className="text-2xl mt-0.5" />
                              {booking.note}
                            </h2>
                          )}
                          <h2 className="flex gap-2 text-lg">
                            <IoPersonOutline className="text-2xl mt-0.5" />
                            {
                              bookingUsers.find(
                                (user) => user.id === booking.uId
                              ).fname
                            }
                            &nbsp;
                            {
                              bookingUsers.find(
                                (user) => user.id === booking.uId
                              ).lname
                            }
                            ,&nbsp;
                            {
                              bookingUsers.find(
                                (user) => user.id === booking.uId
                              ).number
                            }
                          </h2>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        <div className="flex justify-between items-center">
                          <h2 className="flex gap-2 text-lg">
                            <MdOutlineCalendarMonth className="text-2xl mt-1" />
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
                          <CiClock1 className="text-2xl mt-0.5" />
                          {formatTime(booking.datetime)}
                        </h2>
                        {booking.note && (
                          <h2 className="flex gap-2 text-lg">
                            <CiStickyNote className="text-2xl mt-0.5" />
                            {booking.note}
                          </h2>
                        )}
                        <h2 className="flex gap-2 text-lg">
                          <IoPersonOutline className="text-2xl mt-0.5" />
                          {
                            bookingUsersExpired.find(
                              (user) => user.id === booking.uId
                            ).fname
                          }
                          &nbsp;
                          {
                            bookingUsersExpired.find(
                              (user) => user.id === booking.uId
                            ).lname
                          }
                          ,&nbsp;
                          {
                            bookingUsersExpired.find(
                              (user) => user.id === booking.uId
                            ).number
                          }
                        </h2>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      )}
    </>
  );
};

export default AdminPage;
