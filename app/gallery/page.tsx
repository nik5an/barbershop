import React from "react";
import MyNavbar from "@/components/MyNavbar";
import Footer from "@/components/MyFooter";
import Image from "next/image";

const images = [
  "/gallery1.jpg",
  "/gallery2.jpg",
  "/gallery3.jpg",
  "/gallery4.jpg",
];

const Gallery = () => {
  return (
    <>
      <div className="bg-neutral">
        <MyNavbar />
      </div>

      <div className="py-32 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Нашата галерия
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  width={200}
                  height={200}
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Gallery;
