import React, { useState, useEffect } from "react";
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

const EditModal = ({ appointment }: { appointment: any }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Стартови стойности от текущия час
  const [date, setDate] = useState<Date | undefined>(
    new Date(appointment.datetime)
  );
  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [myNote, setNote] = useState(appointment.note || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(
    appointment.datetime.split("T")[1].substring(0, 5)
  );

  const { toast } = useToast();
  const { data: session } = useSession();
  const temp = session?.user.id?.toString();
  const userId = temp ? parseInt(temp) : undefined;

  // Форматиране на час в необходимия формат
  const dateTime =
    date && selectedTimeSlot
      ? new Date(
          date.setHours(
            parseInt(selectedTimeSlot.split(":")[0]),
            parseInt(selectedTimeSlot.split(":")[1])
          )
        )
      : null;

  // Функция за извличане на заетите часове
  const getTimeSlots = async (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split("T")[0]; // Преобразуваме в формат yyyy-mm-dd
    try {
      const response = await fetch(
        `/api/appointment/getBookedSlots?date=${dateString}`
      );
      if (!response.ok) {
        throw new Error("Неуспешно извличане на заетите часове");
      }
      const bookedSlots = await response.json();

      const slots = [];
      for (let hour = 10; hour <= 18; hour++) {
        const fullHour = `${hour < 10 ? "0" + hour : hour}:00`;
        const halfHour = `${hour < 10 ? "0" + hour : hour}:30`;

        slots.push({
          time: fullHour,
          available: !bookedSlots.includes(fullHour),
        });

        slots.push({
          time: halfHour,
          available: !bookedSlots.includes(halfHour),
        });
      }
      setTimeSlots(slots);
    } catch (error) {
      console.error("Грешка при извличането на заетите часове:", error);
      toast({
        title: "Грешка",
        description: "Неуспешно извличане на заетите часове",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (date) {
      getTimeSlots(date);
    }
  }, [date]);

  const handleEdit = async () => {
    if (!date || !selectedTimeSlot) return;

    const updatedDateTime = new Date(
      date.setHours(
        parseInt(selectedTimeSlot.split(":")[0]),
        parseInt(selectedTimeSlot.split(":")[1])
      )
    );

    const response = await fetch("/api/appointment/editBooking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: appointment.id,
        datetime: updatedDateTime,
        note: myNote,
      }),
    });

    if (response.ok) {
      toast({
        title: "Успех",
        description: "Часът е успешно редактиран.",
        variant: "success",
      });
    } else {
      toast({
        title: "Грешка",
        description: "Неуспешно редактиране на час.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="mx-2 p-2 border rounded-lg">
        Редактирай
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle className="mx-auto text-xl font-normal">
            Редакция
          </DialogTitle>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
              <div className="flex flex-col gap-3 items-baseline">
                <h2 className="flex gap-2 text-xl">
                  <MdOutlineCalendarMonth className="text-2xl" />
                  Нова дата
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
                    Нов час
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
              value={myNote}
              onChange={(e) => setNote(e.target.value)}
            />
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
                Запази промените
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-normal text-lg text-black">
                    Сигурни ли сте, че искате да промените часа?
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
                    onClick={handleEdit}
                  >
                    Продължи
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
