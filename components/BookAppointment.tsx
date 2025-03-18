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
import SignInForm from "./form/SignInForm";
import { CiStickyNote } from "react-icons/ci";
import { PiScissorsFill } from "react-icons/pi";
import { FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMin: number;
};

// Define services based on the main page
const SERVICES: Service[] = [
  {
    id: 1,
    name: "Подстрижка",
    price: 15,
    durationMin: 30,
  },
  {
    id: 2,
    name: "Брада",
    price: 10,
    durationMin: 20,
  },
  {
    id: 3,
    name: "Вежди",
    price: 5,
    durationMin: 10,
  },
  {
    id: 4,
    name: "Брада + коса",
    price: 20,
    durationMin: 45,
  },
];

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
  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
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
    if (!date || !selectedTimeSlot || !userId || !selectedService) return;

    const response = await fetch("/api/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datetime: dateTime,
        note: myNote,
        uId: userId,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.durationMin,
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
      <DialogTrigger className="mt-6 px-6 py-3 bg-primary text-xl text-black rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date selection section */}
                <div className="flex flex-col gap-3">
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

                {/* Service selection section */}
                <div>
                  <h2 className="flex gap-2 text-xl">
                    <PiScissorsFill className="text-2xl" />
                    Изберете услуга
                  </h2>
                  <div className="grid grid-cols-1 gap-2 border rounded-lg p-4 mt-2">
                    {SERVICES.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-2 border rounded-lg cursor-pointer hover:bg-black hover:text-white ${
                          selectedService?.id === service.id
                            ? "bg-black text-white"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{service.name}</span>
                          <span>{service.price} лв</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {service.durationMin} минути
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time selection section - now full width */}
              {date && selectedService && (
                <div className="mt-6">
                  <h2 className="flex gap-2 text-xl">
                    <CiClock1 className="text-2xl" />
                    Изберете час
                  </h2>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 border rounded-lg p-4 mt-2">
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

              <Textarea
                placeholder="Бележка (незадължително)"
                className="mt-4"
                onChange={(e) => setNote(e.target.value)}
              ></Textarea>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <AlertDialog>
                <AlertDialogTrigger
                  type="button"
                  disabled={!(date && selectedTimeSlot && selectedService)}
                  className={`bg-black text-white rounded-lg p-3 text-base ${
                    !(date && selectedTimeSlot && selectedService) &&
                    "bg-slate-300"
                  } `}
                >
                  Запази час
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-normal text-lg text-black">
                      Сигурни ли сте, че искате да запазите този час
                    </AlertDialogTitle>
                    {dateTime && selectedService && (
                      <AlertDialogDescription>
                        <p className="flex gap-2 text-lg">
                          <MdOutlineCalendarMonth className="text-2xl" />
                          {dateTime.getDate()}.{dateTime.getMonth() + 1}.
                          {dateTime.getFullYear()}
                        </p>
                        <p className="flex gap-2 text-lg">
                          <CiClock1 className="text-2xl" />
                          {selectedTimeSlot} - {selectedService.name} (
                          {selectedService.durationMin} мин.)
                        </p>
                        <p className="flex gap-2 text-lg">
                          <FaMoneyBillWave className="text-2xl" />
                          Цена: {selectedService.price} лв
                        </p>
                        {myNote && (
                          <p className="flex gap-2 text-lg">
                            <CiStickyNote className="text-2xl" />
                            {myNote}
                          </p>
                        )}
                        <p className="flex gap-2 text-lg text-black mt-4">
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
                    <DialogTrigger>
                      <AlertDialogAction
                        type="button"
                        disabled={
                          !(date && selectedTimeSlot && selectedService)
                        }
                        onClick={() => saveBooking()}
                        className="w-full"
                      >
                        Продължи
                      </AlertDialogAction>
                    </DialogTrigger>
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
