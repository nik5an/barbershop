import MyNavbar from "../components/myNavbar";
import Image from "next/image";
import Footer from "../components/myFooter";
import BookAppointment from "@/components/bookAppointment";

const BG = "/bg.jpg";
const BG1 = "/bg1.jpg";
const CUT = "/cut1.png";
const CUT2 = "/cut2.png";
const BEARD = "/cut.png";
const BROWS = "/brows.png";
const mapsLocation =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1045.85707958013!2d24.74810011948706!3d42.14749345558005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14acd1bcecc64a95%3A0xc9a3fb22a9d7af68!2z0KDQuNC80YHQutC4INGB0YLQsNC00LjQvtC9INC90LAg0KTQuNC70LjQv9C-0L_QvtC7!5e0!3m2!1sbg!2sbg!4v1709800270774!5m2!1sbg!2sbg";

export default function Home() {
  return (
    <div className="relative" id="hero">
      <div>
        <div
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(${BG})` }}
        >
          <MyNavbar />
          <div className="text-white py-4 md:py-24">
            <div className="bg-black bg-opacity-50 rounded-lg py-4 md:py-20 text-center max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-8xl lg:mt-0 outline-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] p-2">
                RELAX BARBERSHOP
              </h1>
              <p className="mt-4 text-lg lg:text-2xl leading-none lg:leading-normal drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                Първокачествено обслужване в уникална атмосфера
              </p>
              <p className="mt-4 text-sm lg:text-lg leading-none lg:leading-normal max-w-xs lg:max-w-lg mx-auto drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)] mb-12 lg:mb-0">
                Помагаме ти да поддържаш брадата си и винаги да изглеждаш в
                най-добър вид. Ела в бръснарницата ни в Пловдив и опитай.
              </p>
              <div className="mt-12 lg:mt-2">
                <BookAppointment></BookAppointment>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto text-center my-8" id="services">
        <h1 className="text-4xl font-bold">Услуги</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 m-4">
          <div>
            <div className="w-48 h-48 flex items-center mx-auto my-8">
              <Image
                src={CUT}
                alt="cut"
                width={200}
                height={200}
                sizes="100%"
                style={{ objectFit: "contain" }}
                className="rounded-full"
              />
            </div>
            <h1 className="text-xl m-4">Подстрижка - 15лв</h1>
          </div>
          <div>
            <div className="w-48 h-48 flex items-center mx-auto my-8">
              <Image
                src={BEARD}
                alt="cut"
                width={200}
                height={200}
                sizes="100%"
                style={{ objectFit: "contain" }}
                className="rounded-full"
              />
            </div>
            <h1 className="text-xl m-4">Брада - 10лв</h1>
          </div>
          <div>
            <div className="w-48 h-48 flex items-center mx-auto my-8">
              <Image
                src={BROWS}
                alt="cut"
                width={200}
                height={200}
                sizes="100%"
                style={{ objectFit: "contain" }}
                className="rounded-full"
              />
            </div>
            <h1 className="text-xl m-4">Вежди - 5лв</h1>
          </div>
          <div>
            <div className="w-48 h-48 flex items-center mx-auto my-8">
              <Image
                src={CUT2}
                alt="cut"
                width={200}
                height={200}
                sizes="100%"
                style={{ objectFit: "contain" }}
                className="rounded-full"
              />
            </div>
            <h1 className="text-xl m-4">Брада + коса - 20лв</h1>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className="bg-cover bg-center bg-fixed "
          style={{ backgroundImage: `url(${BG1})` }}
        >
          <div className="bg-black bg-opacity-70 text-center py-12">
            <h1 className="text-3xl text-white">Работно време</h1>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="m-8 md:m-4 bg-black bg-opacity-80 border border-white border-opacity-50 rounded-full p-8 max-w-xs md:justify-self-end md:w-full">
                <h1 className="text-white text-xl">Понеделник - Събота</h1>
                <p className="text-primary text-md">10:00 - 20:00</p>
              </div>
              <div className="m-8 md:m-4 bg-black bg-opacity-80 border border-white border-opacity-50 rounded-full p-8 max-w-xs md:justify-self-start md:w-full">
                <h1 className="text-white text-xl">Неделя</h1>
                <p className="text-primary text-md">Почивка</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 py-8 px-4 max-w-7xl mx-auto"
        id="about"
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold">За нас</h2>
          <p className="mt-4 text-xl leading-6 max-w-md mx-auto">
            Бръснарницата отваря врати през 2015-та година в сърцето на Пловдив
            и вече 7 години предоставя на своите клиенти първокачествено
            обслужване в уникална атмосфера. С времето се превръща в еталон за
            качествено обслужване и професионализъм.
          </p>
          <div className="mt-6">
            <h3 className="text-3xl font-bold">Адрес</h3>
            <p className="mt-2 text-xl">Пловдив ул. Улица 1</p>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-bold">Телефон</h3>
            <p className="mt-2 text-xl">+359 886 800 008</p>
          </div>
        </div>
        <div className="rounded-lg shadow-lg aspect-w-3 aspect-h-2 mt-4 min-h-96">
          <iframe
            src={mapsLocation}
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
}
