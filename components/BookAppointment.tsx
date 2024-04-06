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

const BookAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<{ time: string }[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();

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

  return (
    <Dialog>
      <DialogTrigger className="mt-6 px-6 py-3 bg-primary text-xl text-black rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
        Запази час
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
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
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={isPast}
                  className="rounded-md border"
                />
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
            ></Textarea>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <>
              <Button type="button" variant={"secondary"}>
                Затвори
              </Button>
              <Button type="button" disabled={!(date && selectedTimeSlot)}>
                Следващ
              </Button>
            </>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointment;
