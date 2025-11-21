import { Metadata } from 'next';
import StructuredData from '@/app/components/StructuredData';

export const metadata: Metadata = {
  title: 'Vanliga frågor om kebab, pizza & falafel | Kebabkartan',
  description: 'Svar på vanliga frågor om kebab, pizza och falafel i Sverige – ställen, betyg och recensioner. Hitta svar på allt du behöver veta.',
  keywords: ['kebab frågor', 'pizza frågor', 'falafel frågor', 'kebab FAQ', 'pizza FAQ', 'falafel FAQ', 'kebab Sverige', 'pizza Sverige', 'falafel Sverige', 'kebabställen', 'pizzerior', 'falafelställen', 'betyg', 'recensioner'],
  openGraph: {
    title: 'Vanliga frågor om kebab, pizza & falafel | Kebabkartan',
    description: 'Svar på vanliga frågor om kebab, pizza och falafel i Sverige – ställen, betyg och recensioner.',
    images: ['/static/logo.png'],
  },
};

const faqData = [
  {
    question: "Vad är Kebabkartan?",
    answer: "Kebabkartan är Sveriges ledande plattform för att hitta och betygsätta kebabställen, pizzerior och falafelställen. Vi hjälper dig upptäcka de bästa ställena i Sverige genom användarrecensioner, betyg och en interaktiv karta."
  },
  {
    question: "Hur fungerar betygsättningen av kebabställen?",
    answer: "Användare kan betygsätta kebabställen, pizzerior och falafelställen på en skala från 1-5 stjärnor och lämna detaljerade recensioner. Betygen sammanställs automatiskt för att visa genomsnittsbetyg för varje ställe."
  },
  {
    question: "Kan jag lägga till nya kebabställen?",
    answer: "Ja! Du kan föreslå nya kebabställen, pizzerior och falafelställen via vår 'Föreslå restaurang'-funktion. Vi granskar alla förslag och lägger till verifierade ställen på kartan."
  },
  {
    question: "Vilka städer täcker Kebabkartan?",
    answer: "Vi täcker hela Sverige med särskilt fokus på Stockholm, Göteborg, Malmö och andra större städer. Vår karta innehåller kebabställen, pizzerior och falafelställen från hela landet."
  },
  {
    question: "Är Kebabkartan gratis att använda?",
    answer: "Ja, Kebabkartan är helt gratis att använda. Du kan söka, läsa recensioner och betygsätta kebabställen utan kostnad."
  },
  {
    question: "Hur vet jag att recensionerna är äkta?",
    answer: "Vi har flera säkerhetsåtgärder för att säkerställa äkta recensioner, inklusive verifiering av användare och spam-detektering. Vi modererar regelbundet innehållet."
  },
  {
    question: "Kan jag söka efter kebab nära mig?",
    answer: "Absolut! Använd vår interaktiva karta för att hitta kebabställen, pizzerior och falafelställen nära din plats. Du kan också använda våra stadsspecifika sidor för Stockholm, Göteborg och Malmö."
  },
  {
    question: "Vad är skillnaden mellan kebab och gyros?",
    answer: "Kebab och gyros är båda grillade kötträtter, men kebab kommer ursprungligen från Turkiet och använder ofta lammkött, medan gyros är grekiskt och använder oftast fläskkött. Båda serveras ofta med bröd och grönsaker."
  },
  {
    question: "Finns det veganska kebabalternativ?",
    answer: "Ja! Många ställen erbjuder veganska alternativ som falafel eller vegansk kebab och pizza. Du kan filtrera efter veganska alternativ på vår karta."
  },
  {
    question: "Hur ofta uppdateras informationen?",
    answer: "Vi uppdaterar vår databas kontinuerligt med nya kebabställen, ändrade öppettider och uppdaterade betyg. Användare kan också rapportera felaktig information."
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Vanliga frågor om kebab, pizza & falafel
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Här hittar du svar på de vanligaste frågorna om kebab, pizza, falafel och Kebabkartan – samt hur du hittar de bästa ställena i Sverige.
        </p>

        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Har du fler frågor?
          </h2>
          <p className="text-blue-800 mb-4">
            Om du inte hittade svar på din fråga här, tveka inte att kontakta oss eller använd vår interaktiva karta för att utforska kebabställen, pizzerior och falafelställen i Sverige.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Utforska Kebabkartan
            </a>
            <a 
              href="/suggestions" 
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
            >
              Föreslå restaurang
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Structured Data */}
      <StructuredData type="faq" data={faqData} />
    </div>
  );
}
