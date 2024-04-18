import MyNavbar from "@/components/myNavbar";
import Footer from "@/components/myFooter";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-neutral">
        <MyNavbar />
      </div>
      <div className="flex-grow mx-auto text-center my-8">
        <h1 className="text-4xl font-bold">Условия за ползване</h1>
        <div className="max-w-3xl mx-auto mt-8">
          <p className="text-lg">
            Добре дошли в Условията за ползване на Relax Barbershop. Моля,
            прочетете внимателно тези условия, преди да използвате нашия
            уебсайт.
          </p>
          <p className="text-lg mt-4">
            Използвайки нашия уебсайт, вие се съгласявате с тези Условия за
            ползване. Ако не се съгласявате с тези условия, моля, не използвайте
            нашия уебсайт.
          </p>
          <p className="text-lg mt-4">
            Ние можем да променяме Условията за ползване по всяко време, като
            актуализираме тази страница. Моля, проверявайте редовно за
            актуализации. Вашето продължаване на използване на уебсайта след
            публикуването на промените означава вашето приемане на тези промени.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
