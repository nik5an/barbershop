"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { Calendar } from "@/components/ui/calendar";
import { CiClock1 } from "react-icons/ci";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { isPast } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import SignInForm from "./form/signInForm";
import { CiStickyNote } from "react-icons/ci";
import Link from "next/link";

const BookAppointment = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState<Date | undefined>(tomorrow);
  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [myNote, setNote] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const { toast } = useToast();
  const { data: session } = useSession();
  const temp = session?.user.id?.toString();
  const userId = temp ? parseInt(temp) : undefined;
  const dateTime =
    date && selectedTimeSlot
      ? new Date(
          date.setHours(
            parseInt(selectedTimeSlot.split(":")[0]),
            parseInt(selectedTimeSlot.split(":")[1])
          )
        )
      : null;

  useEffect(() => {
    if (date) {
      getTime();
    } else {
      setTimeSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const getTime = async () => {
    if (!date) return;

    try {
      const timeZoneOffset = date.getTimezoneOffset();
      const timeZoneDate = new Date(date.getTime() - timeZoneOffset * 60000);

      const formattedDate = timeZoneDate.toISOString().split("T")[0];
      const response = await fetch(
        `/api/appointment/getBookedSlots?date=${formattedDate}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch booked slots");
      }
      const bookedSlots = await response.json();

      const timeList = [];
      for (let i = 10; i <= 18; i++) {
        const time = `${i < 10 ? "0" + i : i}:00`;
        const available = !bookedSlots.includes(time);
        timeList.push({
          time,
          available,
        });
        if (i !== 18) {
          const halfHourTime = `${i < 10 ? "0" + i : i}:30`;
          const halfHourAvailable = !bookedSlots.includes(halfHourTime);
          timeList.push({
            time: halfHourTime,
            available: halfHourAvailable,
          });
        }
      }
      setTimeSlots(timeList);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booked slots",
        variant: "destructive",
      });
    }
  };

  const saveBooking = async () => {
    if (!date || !selectedTimeSlot || !userId) return;

    const response = await fetch("/api/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datetime: dateTime,
        note: myNote,
        uId: userId,
      }),
    });

    if (response.ok) {
      toast({
        title: "Success",
        description: (
          <>
            Вие успешно запазихте час. Може да си видите часа от Профил -&gt;
            Моите часове или като цъкнете{" "}
            <Link href="/my-booking" className="text-black hover:underline">
              тук
            </Link>
          </>
        ),
        variant: "success",
      });

      getTime();
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="mt-6 px-6 py-3 bg-primary text-xl text-black rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
        ЗАПАЗИ ЧАС
      </DialogTrigger>
      {!session?.user ? (
        <DialogContent>
          <DialogTitle className="mx-auto text-xl font-normal">
            Моля влезнете в профила си за да продължите
          </DialogTitle>
          <SignInForm></SignInForm>
        </DialogContent>
      ) : (
        <DialogContent className="max-w-2xl overflow-y-scroll max-h-screen ">
          <DialogHeader>
            <DialogTitle className="mx-auto text-xl font-normal">
              Избор на време
            </DialogTitle>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                <div className="flex flex-col gap-3 items-baseline">
                  <h2 className="flex gap-2 text-xl">
                    <MdOutlineCalendarMonth className="text-2xl" />
                    Изберете дата
                  </h2>
                  <div className="flex justify-center mx-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={isPast}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                {date && (
                  <div className="mt-1">
                    <h2 className="flex gap-2 text-xl">
                      <CiClock1 className="text-2xl" />
                      Изберете час
                    </h2>
                    <div className="grid grid-cols-3 gap-2 border rounded-lg p-4 mt-2">
                      {timeSlots.map((item, index) => (
                        <h2
                          key={index}
                          onClick={() => {
                            if (selectedTimeSlot === item.time) {
                              setSelectedTimeSlot(undefined);
                            } else if (item.available) {
                              setSelectedTimeSlot(item.time);
                            }
                          }}
                          className={`p-2 border rounded-full text-center ${
                            !item.available
                              ? "bg-gray-300 text-gray-600 cursor-default"
                              : "cursor-pointer hover:bg-black hover:text-white"
                          } ${
                            item.time === selectedTimeSlot &&
                            item.available &&
                            "bg-black text-white"
                          }`}
                        >
                          {item.time}
                        </h2>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Textarea
                placeholder="Бележка (незадължително)"
                className="mt-2"
                onChange={(e) => setNote(e.target.value)}
              ></Textarea>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <AlertDialog>
                <AlertDialogTrigger
                  type="button"
                  disabled={!(date && selectedTimeSlot)}
                  className="bg-black text-white rounded-lg p-3 text-base"
                >
                  Запази час
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-normal text-lg text-black">
                      Сигурни ли сте, че искате да запазите този час
                    </AlertDialogTitle>
                    {dateTime && (
                      <AlertDialogDescription>
                        <p className="flex gap-2 text-lg">
                          <MdOutlineCalendarMonth className="text-2xl" />
                          {dateTime.getDate()}.{dateTime.getMonth() + 1}.
                          {dateTime.getFullYear()}
                        </p>
                        <p className="flex gap-2 text-lg">
                          <CiClock1 className="text-2xl" />
                          {selectedTimeSlot}
                        </p>
                        {myNote && (
                          <p className="flex gap-2 text-lg">
                            <CiStickyNote className="text-2xl" />
                            {myNote}
                          </p>
                        )}
                        <p className="flex gap-2 text-lg text-black">
                          Политика за анулиране на час:
                        </p>
                        <p className="flex gap-2 text-base">
                          Моля не анулирайте запазен час в рамките на 3 часа до
                          него.
                        </p>
                      </AlertDialogDescription>
                    )}
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Затвори</AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      disabled={!(date && selectedTimeSlot)}
                      onClick={() => saveBooking()}
                    >
                      Продължи
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default BookAppointment;
