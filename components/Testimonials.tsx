"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Масив с отзиви от клиенти
const testimonials = [
  {
    id: 1,
    name: "Георги Иванов",
    image: "/client1.jpg", // Заменете с реални снимки
    rating: 5,
    text: "Най-добрата бръснарница в Пловдив! Винаги излизам доволен от прическата. Персоналът е изключително професионален и приятелски настроен.",
  },
  {
    id: 2,
    name: "Димитър Петров",
    image: "/client2.jpg", // Заменете с реални снимки
    rating: 5,
    text: "Открих RELAX BARBERSHOP преди 2 години и вече не ходя на друго място. Прецизност, качество и приятна атмосфера на отлична цена.",
  },
  {
    id: 3,
    name: "Николай Тодоров",
    image: "/client3.jpg", // Заменете с реални снимки
    rating: 5,
    text: "Обичам, че мога да запазя час онлайн. Избирам услугата, която искам, и в удобно за мен време съм обслужен перфектно. Препоръчвам на всички!",
  },
  {
    id: 4,
    name: "Стефан Алексиев",
    image: "/client4.jpg", // Заменете с реални снимки
    rating: 4,
    text: "Отлична бръснарница с професионални бръснари. Модерна и стилна подстрижка всеки път. Единственото нещо, което бих променил, е да има повече свободни часове.",
  },
  {
    id: 5,
    name: "Валентин Маринов",
    image: "/client5.jpg", // Заменете с реални снимки
    rating: 5,
    text: "Подстригването на брадата тук е изкуство! Препоръчвам на всеки, който държи на детайлите и търси професионализъм.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      handlePrevious();
    }
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">
          Отзиви от клиенти
        </h2>

        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 w-full z-10 px-4">
            <button
              onClick={handlePrevious}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
              aria-label="Предишен отзив"
            >
              <FaChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={handleNext}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
              aria-label="Следващ отзив"
            >
              <FaChevronRight className="text-2xl" />
            </button>
          </div>

          <div className="transition-all duration-500">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-lg text-gray-600">
                        {testimonials[currentIndex].name.charAt(0)}
                      </span>
                    </div>
                    {/* Заменете с реални снимки на клиенти или използвайте инициали */}
                    {/* <Image 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name} 
                      fill
                      style={{ objectFit: "cover" }}
                    /> */}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < testimonials[currentIndex].rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        } text-xl`}
                      />
                    ))}
                  </div>

                  <div className="mb-4 relative">
                    <FaQuoteLeft className="text-primary text-opacity-20 absolute -top-4 -left-2 text-4xl" />
                    <p className="text-gray-600 italic text-lg leading-relaxed">
                      {testimonials[currentIndex].text}
                    </p>
                    <FaQuoteRight className="text-primary text-opacity-20 absolute -bottom-4 right-0 text-4xl" />
                  </div>

                  <p className="text-xl font-semibold">
                    {testimonials[currentIndex].name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  currentIndex === index ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Отиди към отзив ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
