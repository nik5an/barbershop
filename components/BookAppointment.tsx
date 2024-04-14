"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { CiClock1 } from "react-icons/ci";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { isPast } from "date-fns";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import SignInForm from "./form/SignInForm";

const BookAppointment = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState<Date | undefined>(tomorrow);
  const [timeSlot, setTimeSlot] = useState<{ time: string }[]>([]);
  const [myNote, setNote] = useState("");
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const { data: session } = useSession();
  const temp = session?.user.id?.toString();
  const userId = temp ? parseInt(temp) : undefined;
  const dateTime =
    date && selectedTimeSlot
      ? new Date(
          date.setHours(
            parseInt(selectedTimeSlot.split(":")[0]) + 3,
            parseInt(selectedTimeSlot.split(":")[1])
          )
        )
      : null;
  useEffect(() => {
    getTime();
  }, []);

  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 18; i++) {
      timeList.push({
        time: `${i}:00`,
      });
      timeList.push({
        time: `${i}:30`,
      });
    }
    setTimeSlot(timeList);
  };

  const saveBooking = async () => {
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
        description: "Вие успешно запазихте час.",
        variant: "success",
      });
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
        Запази час
      </DialogTrigger>
      {!session?.user ? (
        <DialogContent>
          <DialogTitle className="mx-auto text-xl font-normal">
            Моля влезнете в профила си за да продължите
          </DialogTitle>
          <SignInForm></SignInForm>
        </DialogContent>
      ) : (
        <DialogContent className="max-w-2xl overflow-y-scroll max-h-screen">
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
                <div className="mt-1">
                  <h2 className="flex gap-2 text-xl">
                    <CiClock1 className="text-2xl" />
                    Изберете час
                  </h2>
                  <div className="grid grid-cols-3 gap-2 border rounded-lg p-4 mt-2">
                    {timeSlot.map((item, index) => (
                      <h2
                        key={index}
                        onClick={() => setSelectedTimeSlot(item.time)}
                        className={`p-2 border rounded-full text-center hover:bg-black hover:text-white cursor-pointer 
                      ${
                        item.time == selectedTimeSlot && "bg-black text-white"
                      }`}
                      >
                        {item.time}
                      </h2>
                    ))}
                  </div>
                </div>
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
              <Button
                type="button"
                disabled={!(date && selectedTimeSlot)}
                onClick={() => saveBooking()}
              >
                Запази час
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default BookAppointment;
