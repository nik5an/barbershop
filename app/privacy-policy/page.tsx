import MyNavbar from "@/components/MyNavbar";
import Footer from "@/components/MyFooter";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-neutral">
        <MyNavbar />
      </div>
      <div className="flex-grow mx-auto text-center my-8">
        <h1 className="text-4xl font-bold">Политика за поверителност</h1>
        <div className="max-w-3xl mx-auto mt-8">
          <p className="text-lg">
            Нашата бръснарница, Relax Barbershop, е ангажирана със защитата на
            вашата лична информация. Тази политика за поверителност обяснява
            каква информация събираме от вас, защо я събираме и как я
            използваме.
          </p>
          <p className="text-lg mt-4">
            Ние събираме информация, когато правите запис за час в нашата
            бръснарница, включително вашето име, контактна информация и
            предпочитания за услуга. Тази информация се използва само за
            обработка на вашата заявка за запис.
          </p>
          <p className="text-lg mt-4">
            Нашата бръснарница не споделя вашата лична информация с трети страни
            без вашето разрешение, освен ако е необходимо за обработката на
            вашата заявка за запис.
          </p>
          <p className="text-lg mt-4">
            Ние можем да използваме бисквитки и подобни технологии, за да
            подобрим вашето преживяване на нашия уебсайт и да анализираме
            трафика. .
          </p>
          <p className="text-lg mt-4">
            При въпроси относно нашата политика за поверителност, моля, свържете
            се с нас на&nbsp;
            <a
              href="mailto:info@relaxbarbershop.com"
              className="text-primary-content underline"
            >
              info@relaxbarbershop.com
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
