import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import BottomNavigation from '@/app/components/layout/BottomNavigation';

export const metadata: Metadata = {
  title: 'Användarvillkor | Kebabkartan',
  description: 'Läs våra användarvillkor för att använda Kebabkartan. Regler och riktlinjer för recensioner, betyg och användning av tjänsten.',
  openGraph: {
    title: 'Användarvillkor | Kebabkartan',
    description: 'Läs våra användarvillkor för att använda Kebabkartan.',
    images: ['/static/logo.png'],
  },
};

export default function AnvandarvillkorPage() {
  return (
    <>
      <Header showSearch={false} />

      <main className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-secondary transition-colors mb-4"
            >
              ← Tillbaka till startsidan
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Användarvillkor
            </h1>
            <p className="text-lg text-text-muted">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduktion och godkännande</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Välkommen till Kebabkartan! Dessa användarvillkor ("Villkoren") reglerar din användning av
                webbplatsen kebabkartan.se och relaterade tjänster (gemensamt kallat "Tjänsten").
                Tjänsten tillhandahålls av Kebabkartan AB, organisationsnummer [XXX], ("vi", "oss", "vår").
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Genom att använda Tjänsten godkänner du dessa Villkor. Om du inte godkänner Villkoren,
                var vänlig och använd inte Tjänsten.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Vi förbehåller oss rätten att ändra dessa Villkor när som helst. Väsentliga ändringar kommer
                att meddelas via e-post eller genom meddelande på Tjänsten.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Behörighet att använda Tjänsten</h2>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li>Du måste vara minst 13 år gammal för att skapa ett konto och använda Tjänsten</li>
                <li>Användare under 18 år måste ha tillstånd från förälder/vårdnadshavare</li>
                <li>Du måste tillhandahålla korrekta och sanningsenliga uppgifter vid registrering</li>
                <li>Du får endast ha ett (1) aktivt användarkonto</li>
                <li>Du ansvarar för att hålla ditt lösenord säkert och konfidentiellt</li>
              </ul>
            </section>

            {/* Account */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Användarkonto</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Registrering</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                För att använda vissa funktioner måste du skapa ett konto. Du samtycker till att:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li>Tillhandahålla korrekt, aktuell och fullständig information</li>
                <li>Hålla din kontoinformation uppdaterad</li>
                <li>Inte dela ditt konto med andra personer</li>
                <li>Omedelbart meddela oss om obehörig användning av ditt konto</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Kontostängning</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi förbehåller oss rätten att stänga av eller avsluta ditt konto om du:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li>Bryter mot dessa Villkor</li>
                <li>Publicerar olämpligt, bedrägligt eller olagligt innehåll</li>
                <li>Försöker manipulera betyg eller recensioner</li>
                <li>Trakasserar eller hotar andra användare</li>
                <li>Använder automatiserade verktyg eller botar</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Borttagning av konto</h3>
              <p className="text-slate-700 leading-relaxed">
                Du kan när som helst begära borttagning av ditt konto genom att kontakta oss på
                kontakt@kebabkartan.se. Efter borttagning kommer dina personuppgifter att raderas enligt vår{' '}
                <Link href="/integritetspolicy" className="text-primary hover:underline">integritetspolicy</Link>.
                Observera att offentliga recensioner kan förbli synliga men anonymiseras.
              </p>
            </section>

            {/* Acceptable use */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptabel användning</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Tillåten användning</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Du får använda Tjänsten för att:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li>Söka efter och upptäcka restauranger, pizzerior och kebabställen</li>
                <li>Läsa recensioner och betyg från andra användare</li>
                <li>Skriva ärliga och sanningsenliga recensioner baserade på din egen upplevelse</li>
                <li>Betygsätta restauranger du har besökt</li>
                <li>Föreslå nya restauranger till Tjänsten</li>
                <li>Interagera med andra användares innehåll (gilla, kommentera)</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 Förbjuden användning</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Du får INTE använda Tjänsten för att:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li>Publicera falska, vilseledande eller bedrägliga recensioner</li>
                <li>Skriva recensioner för restauranger du inte besökt</li>
                <li>Ta betalt för att skriva positiva recensioner eller negativa recensioner om konkurrenter</li>
                <li>Manipulera betyg genom flera konton, botar eller andra oärliga metoder</li>
                <li>Publicera hatefullt, kränkande, trakasserande eller hotfullt innehåll</li>
                <li>Dela andras personuppgifter utan tillstånd</li>
                <li>Kopiera, reproducera eller distribuera innehåll från Tjänsten utan tillstånd</li>
                <li>Använda automatiserade verktyg, botar, skrapor eller liknande för att samla in data</li>
                <li>Försöka få obehörig åtkomst till Tjänstens system eller andra användares konton</li>
                <li>Överföra virus, skadlig kod eller annat skadligt material</li>
                <li>Bryta mot svensk lag eller internationell lag</li>
              </ul>
            </section>

            {/* User content */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Användargenererat innehåll</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Ditt ansvar</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Du är ensam ansvarig för allt innehåll du publicerar på Tjänsten ("Användarinnehåll").
                Du garanterar att ditt Användarinnehåll:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li>Är sanningsenligt och baserat på din faktiska upplevelse</li>
                <li>Inte kränker tredje parts rättigheter (upphovsrätt, varumärke, sekretess)</li>
                <li>Inte innehåller olagligt, obscent, hatefullt eller diskriminerande material</li>
                <li>Inte innehåller reklam, spam eller självpromotion utan vårt godkännande</li>
                <li>Följer svensk lag och dessa Villkor</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Licens till oss</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Genom att publicera Användarinnehåll ger du Kebabkartan en icke-exklusiv, överlåtbar, sublicensierbar,
                royaltyfri, global licens att använda, reproducera, distribuera, förbereda härledda verk av,
                visa och utföra ditt Användarinnehåll i samband med Tjänsten och vårt företag.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Du behåller alla äganderätter till ditt Användarinnehåll. Denna licens upphör när du raderar
                ditt innehåll eller ditt konto, utom där innehållet har delats med andra användare.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 Moderering</h3>
              <p className="text-slate-700 leading-relaxed">
                Vi förbehåller oss rätten att granska, redigera eller ta bort Användarinnehåll som bryter mot
                dessa Villkor eller som vi anser vara olämpligt. Vi är dock inte skyldiga att övervaka allt
                Användarinnehåll och ansvarar inte för innehåll som publiceras av användare.
              </p>
            </section>

            {/* Intellectual property */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Immateriella rättigheter</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Vår äganderätt</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Tjänsten och allt innehåll, funktioner och funktionalitet (inklusive men inte begränsat till
                all information, programvara, text, bilder, grafik, logotyper, design och urval och arrangemang
                av dessa) ägs av Kebabkartan AB och skyddas av svensk och internationell upphovsrätt, varumärkes-
                och annan immaterialrätt.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Begränsad licens till dig</h3>
              <p className="text-slate-700 leading-relaxed">
                Vi ger dig en begränsad, icke-exklusiv, icke-överlåtbar licens att komma åt och använda Tjänsten
                för personligt, icke-kommersiellt bruk. Du får inte:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2 mt-4">
                <li>Kopiera, modifiera eller distribuera innehåll från Tjänsten</li>
                <li>Använda innehåll för kommersiella ändamål utan skriftligt tillstånd</li>
                <li>Ta bort upphovsrätts- eller äganderättsanmärkningar</li>
                <li>Dekompilera, reverse-engineera eller demontera Tjänsten</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Ansvarsfriskrivning</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">7.1 Tjänsten "som den är"</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Tjänsten tillhandahålls "i befintligt skick" och "som tillgänglig" utan garantier av något slag,
                vare sig uttryckliga eller underförstådda. Vi garanterar inte att Tjänsten kommer att vara
                oavbruten, säker eller felfri.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">7.2 Användarinnehåll</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Recensioner och betyg på Tjänsten representerar användarnas egna åsikter och är inte våra.
                Vi garanterar inte noggrannheten, fullständigheten eller användbarheten av något Användarinnehåll.
                Du förlitar dig på sådant innehåll på egen risk.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">7.3 Restauranginformation</h3>
              <p className="text-slate-700 leading-relaxed">
                Information om restauranger (öppettider, adresser, menyer, priser) tillhandahålls av användare
                och tredje parter. Vi gör vårt bästa för att hålla informationen uppdaterad men kan inte
                garantera dess riktighet. Kontakta alltid restaurangen direkt för att bekräfta information.
              </p>
            </section>

            {/* Limitation of liability */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Ansvarsbegränsning</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                I den utsträckning som tillåts enligt svensk lag, ska Kebabkartan AB, dess direktörer, anställda,
                partners, agenter eller innehållsleverantörer inte hållas ansvariga för:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li>Indirekta, tillfälliga, speciella, följd- eller straffskador</li>
                <li>Förlust av vinst, intäkter, data eller användning</li>
                <li>Kostnader för anskaffning av ersättningsvaror eller -tjänster</li>
                <li>Skador relaterade till Användarinnehåll eller tredje parts innehåll</li>
                <li>Obehörig åtkomst till eller ändring av din data</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                Vårt totala ansvar gentemot dig för alla anspråk relaterade till Tjänsten är begränsat till
                det belopp du betalat till oss under de senaste 12 månaderna, eller 100 SEK, beroende på vilket
                som är högre.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Gottgörelse</h2>
              <p className="text-slate-700 leading-relaxed">
                Du samtycker till att försvara, gottgöra och hålla Kebabkartan AB, dess dotterbolag, dotterbolag,
                licensgivare och tjänsteleverantörer, och deras respektive tjänstemän, direktörer, anställda,
                entreprenörer, agenter, licensgivare, leverantörer och tillhandahållare skadeslösa från och mot
                alla anspråk, skadestånd, förpliktelser, förluster, skyldigheter, kostnader eller skulder och
                utgifter (inklusive men inte begränsat till advokatkostnader) som härrör från:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2 mt-4">
                <li>Din användning av och åtkomst till Tjänsten</li>
                <li>Din överträdelse av dessa Villkor</li>
                <li>Din överträdelse av tredje parts rättigheter, inklusive men inte begränsat till
                    upphovsrätt, egendom eller integritet</li>
                <li>Ditt Användarinnehåll</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Uppsägning</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi kan avsluta eller stänga av din åtkomst till Tjänsten omedelbart, utan föregående meddelande
                eller ansvar, av vilken anledning som helst, inklusive men inte begränsat till om du bryter mot
                dessa Villkor.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vid uppsägning upphör din rätt att använda Tjänsten omedelbart. Om du vill avsluta ditt konto,
                kan du helt enkelt sluta använda Tjänsten eller kontakta oss för att begära kontoborttagning.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Alla bestämmelser i Villkoren som genom sin natur bör överleva uppsägning ska överleva uppsägning,
                inklusive men inte begränsat till äganderättsbestämmelser, garantifriskrivningar, gottgörelse
                och ansvarsbegränsningar.
              </p>
            </section>

            {/* Governing law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Tillämplig lag och tvister</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Dessa Villkor ska regleras av och tolkas i enlighet med svensk lag, utan hänsyn till dess
                kollisionsregler.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Eventuella tvister som uppstår i samband med dessa Villkor eller Tjänsten ska avgöras av svensk
                domstol, med exklusiv jurisdiktion i [Ort], Sverige.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Om du är konsument har du också rätt att vända dig till Allmänna reklamationsnämnden (ARN)
                eller Europeiska kommissionens tvistlösningsplattform för att lösa eventuella tvister.
              </p>
            </section>

            {/* Changes to terms */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Ändringar av villkoren</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi förbehåller oss rätten att när som helst ändra eller ersätta dessa Villkor efter eget
                gottfinnande. Om en revision är väsentlig kommer vi att försöka ge minst 30 dagars varsel
                innan några nya villkor träder i kraft.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Genom att fortsätta att använda Tjänsten efter att eventuella ändringar träder i kraft,
                samtycker du till att vara bunden av de reviderade villkoren. Om du inte godkänner de nya
                villkoren, var vänlig sluta använda Tjänsten.
              </p>
            </section>

            {/* Miscellaneous */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Övrigt</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">13.1 Hela avtalet</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Dessa Villkor utgör hela avtalet mellan dig och Kebabkartan AB angående din användning av Tjänsten
                och ersätter alla tidigare avtal och överenskommelser.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">13.2 Delbarhet</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Om någon bestämmelse i dessa Villkor anses vara olaglig, ogiltig eller ej verkställbar, ska
                den bestämmelsen ändras och tolkas för att uppnå målen med bestämmelsen i största möjliga
                utsträckning enligt tillämplig lag, och de återstående bestämmelserna ska fortsätta att gälla.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">13.3 Avstående från rättigheter</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Att vi underlåter att utöva eller verkställa någon rättighet eller bestämmelse i dessa Villkor
                ska inte utgöra ett avstående från sådan rättighet eller bestämmelse.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">13.4 Överlåtelse</h3>
              <p className="text-slate-700 leading-relaxed">
                Du får inte överlåta eller överföra dessa Villkor eller dina rättigheter häri utan vårt
                skriftliga samtycke. Vi kan fritt överlåta eller överföra dessa Villkor.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Kontakta oss</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Om du har frågor om dessa Användarvillkor, kontakta oss:
              </p>

              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700 font-semibold mb-2">Kebabkartan AB</p>
                <p className="text-slate-700">
                  E-post:{' '}
                  <a href="mailto:kontakt@kebabkartan.se" className="text-primary hover:underline">
                    kontakt@kebabkartan.se
                  </a>
                </p>
                <p className="text-slate-700 mt-4">
                  Webbplats:{' '}
                  <a href="https://kebabkartan.se" className="text-primary hover:underline">
                    kebabkartan.se
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-secondary transition-colors font-medium"
            >
              ← Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </>
  );
}
