import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import BottomNavigation from '@/app/components/layout/BottomNavigation';

export const metadata: Metadata = {
  title: 'Integritetspolicy | Kebabkartan',
  description: 'Läs om hur Kebabkartan hanterar och skyddar dina personuppgifter. Vi värnar om din integritet och följer GDPR.',
  openGraph: {
    title: 'Integritetspolicy | Kebabkartan',
    description: 'Läs om hur Kebabkartan hanterar och skyddar dina personuppgifter.',
    images: ['/static/logo.png'],
  },
};

export default function IntegritetspolicyPage() {
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
              Integritetspolicy
            </h1>
            <p className="text-lg text-text-muted">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduktion</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Kebabkartan AB ("vi", "oss", "vår") är ansvarig för behandlingen av dina personuppgifter.
                Vi värnar om din integritet och är engagerade i att skydda dina personuppgifter.
                Denna integritetspolicy förklarar hur vi samlar in, använder, delar och skyddar dina personuppgifter
                när du använder vår webbplats kebabkartan.se ("Tjänsten").
              </p>
              <p className="text-slate-700 leading-relaxed">
                Genom att använda vår Tjänst godkänner du insamling och användning av information i enlighet med denna policy.
              </p>
            </section>

            {/* What data we collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Personuppgifter vi samlar in</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Uppgifter du tillhandahåller</h3>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li><strong>Kontouppgifter:</strong> Användarnamn, e-postadress, lösenord (krypterat)</li>
                <li><strong>Profiluppgifter:</strong> Profilbild, biografi, visningsnamn (om du väljer att ange dessa)</li>
                <li><strong>Innehåll:</strong> Recensioner, betyg, kommentarer och förslag på restauranger</li>
                <li><strong>Kommunikation:</strong> Meddelanden du skickar till oss via e-post eller formulär</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Uppgifter vi samlar in automatiskt</h3>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li><strong>Användningsdata:</strong> IP-adress, webbläsartyp, besökta sidor, tid på webbplatsen</li>
                <li><strong>Enhetsdata:</strong> Enhetstyp, operativsystem, unika enhets-ID</li>
                <li><strong>Platsdata:</strong> Ungefärlig geografisk plats baserad på IP-adress (om du ger tillåtelse)</li>
                <li><strong>Cookies och liknande teknik:</strong> Se vår <Link href="/cookies" className="text-primary hover:underline">cookiepolicy</Link></li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 Uppgifter från tredje part</h3>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li><strong>Social inloggning:</strong> Om du loggar in via Google får vi grundläggande profiluppgifter (namn, e-post, profilbild)</li>
                <li><strong>Kartdata:</strong> Vi använder OpenStreetMap för kartfunktionalitet</li>
              </ul>
            </section>

            {/* How we use data */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Hur vi använder dina personuppgifter</h2>
              <p className="text-slate-700 leading-relaxed mb-4">Vi använder dina personuppgifter för följande ändamål:</p>

              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li><strong>Tillhandahålla Tjänsten:</strong> Skapa och hantera ditt konto, visa recensioner och betyg</li>
                <li><strong>Förbättra Tjänsten:</strong> Analysera användning, utveckla nya funktioner, förbättra användarupplevelsen</li>
                <li><strong>Kommunikation:</strong> Skicka viktiga meddelanden, uppdateringar, nyhetsbrev (om du har samtyckt)</li>
                <li><strong>Säkerhet:</strong> Upptäcka och förhindra bedrägeri, missbruk och säkerhetsbrott</li>
                <li><strong>Juridiska krav:</strong> Uppfylla juridiska förpliktelser och verkställa våra villkor</li>
                <li><strong>Spam-skydd:</strong> Använda Google reCAPTCHA för att skydda mot spam och missbruk</li>
              </ul>
            </section>

            {/* Legal basis */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Rättslig grund för behandling</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi behandlar dina personuppgifter baserat på följande rättsliga grunder enligt GDPR:
              </p>

              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li><strong>Fullgörande av avtal:</strong> För att tillhandahålla Tjänsten enligt våra användarvillkor</li>
                <li><strong>Samtycke:</strong> När du har gett ditt uttryckliga samtycke (t.ex. nyhetsbrev, cookies)</li>
                <li><strong>Berättigat intresse:</strong> För att förbättra Tjänsten, säkerhet och marknadsföring</li>
                <li><strong>Rättslig förpliktelse:</strong> För att uppfylla lagkrav</li>
              </ul>
            </section>

            {/* Sharing data */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Delning av personuppgifter</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi säljer aldrig dina personuppgifter. Vi delar dina uppgifter endast i följande situationer:
              </p>

              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li><strong>Tjänsteleverantörer:</strong> AWS (hosting), Google (Analytics, reCAPTCHA, autentisering), OpenStreetMap (kartor)</li>
                <li><strong>Offentligt innehåll:</strong> Recensioner och betyg du publicerar är offentliga och kan ses av alla användare</li>
                <li><strong>Juridiska krav:</strong> Om det krävs enligt lag, domstolsbeslut eller myndighetskrav</li>
                <li><strong>Företagsöverlåtelse:</strong> Vid fusion, förvärv eller försäljning av tillgångar</li>
              </ul>
            </section>

            {/* Data storage */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Lagring och säkerhet</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Var lagras dina uppgifter?</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Dina personuppgifter lagras på säkra servrar hos Amazon Web Services (AWS) i EU-regionen.
                Vi använder AWS Cognito för autentisering och AWS DynamoDB för datalagring.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Hur länge lagras dina uppgifter?</h3>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed mb-4 space-y-2">
                <li><strong>Kontouppgifter:</strong> Tills du begär borttagning av ditt konto</li>
                <li><strong>Recensioner och betyg:</strong> Tills du raderar dem eller begär kontoborttagning</li>
                <li><strong>Användningsdata:</strong> Max 26 månader (Google Analytics)</li>
                <li><strong>Cookies:</strong> Enligt vår <Link href="/cookies" className="text-primary hover:underline">cookiepolicy</Link></li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Säkerhetsåtgärder</h3>
              <p className="text-slate-700 leading-relaxed">
                Vi använder branschstandardiserade säkerhetsåtgärder inklusive SSL/TLS-kryptering,
                säker autentisering via AWS Cognito, brandväggar och regelbundna säkerhetsgranskningar.
              </p>
            </section>

            {/* Your rights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Dina rättigheter enligt GDPR</h2>
              <p className="text-slate-700 leading-relaxed mb-4">Du har följande rättigheter enligt GDPR:</p>

              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2">
                <li><strong>Rätt till tillgång:</strong> Begära kopia av dina personuppgifter</li>
                <li><strong>Rätt till rättelse:</strong> Korrigera felaktiga eller ofullständiga uppgifter</li>
                <li><strong>Rätt till radering:</strong> Begära borttagning av dina personuppgifter ("rätten att bli glömd")</li>
                <li><strong>Rätt till begränsning:</strong> Begära begränsad behandling av dina uppgifter</li>
                <li><strong>Rätt till dataportabilitet:</strong> Få dina uppgifter i strukturerat, maskinläsbart format</li>
                <li><strong>Rätt att göra invändningar:</strong> Invända mot behandling baserad på berättigat intresse</li>
                <li><strong>Rätt att återkalla samtycke:</strong> Återkalla tidigare lämnat samtycke när som helst</li>
              </ul>

              <p className="text-slate-700 leading-relaxed mt-4">
                För att utöva dina rättigheter, kontakta oss på{' '}
                <a href="mailto:kontakt@kebabkartan.se" className="text-primary hover:underline">
                  kontakt@kebabkartan.se
                </a>
              </p>
            </section>

            {/* Third party services */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Tredjepartstjänster</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.1 Google Analytics</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi använder Google Analytics för att analysera användning av vår webbplats.
                Google Analytics använder cookies för att samla in anonymiserad data om besökare.
                Läs mer i <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Googles integritetspolicy</a>.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.2 Google reCAPTCHA</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi använder Google reCAPTCHA v3 för att skydda mot spam och missbruk.
                reCAPTCHA samlar in hårdvaru- och programvaruinformation och skickar den till Google.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.3 AWS Cognito</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Autentisering och användarhantering sköts av AWS Cognito, som följer strikta säkerhetsstandarder.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.4 OpenStreetMap</h3>
              <p className="text-slate-700 leading-relaxed">
                Våra kartor tillhandahålls av OpenStreetMap. När du använder kartan kan OpenStreetMap samla in viss data.
              </p>
            </section>

            {/* Children's privacy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Barn och unga</h2>
              <p className="text-slate-700 leading-relaxed">
                Vår Tjänst är inte riktad till barn under 13 år. Vi samlar inte medvetet in personuppgifter från barn.
                Om du är förälder/vårdnadshavare och upptäcker att ditt barn har lämnat personuppgifter till oss,
                kontakta oss omedelbart så raderar vi informationen.
              </p>
            </section>

            {/* International transfers */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Internationella överföringar</h2>
              <p className="text-slate-700 leading-relaxed">
                Dina personuppgifter lagras primärt inom EU/EES. När vi använder tjänsteleverantörer utanför EU/EES
                (t.ex. vissa Google-tjänster), säkerställer vi att lämpliga skyddsåtgärder finns på plats enligt GDPR,
                såsom EU:s standardavtalsklausuler.
              </p>
            </section>

            {/* Changes to policy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Ändringar av integritetspolicyn</h2>
              <p className="text-slate-700 leading-relaxed">
                Vi kan uppdatera denna integritetspolicy från tid till annan. Vi meddelar dig om väsentliga ändringar
                genom att publicera den nya policyn på denna sida och uppdatera "Senast uppdaterad"-datumet.
                Du uppmanas att granska denna policy regelbundet.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Kontakta oss</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Om du har frågor om denna integritetspolicy eller vill utöva dina rättigheter, kontakta oss:
              </p>

              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700 font-semibold mb-2">Kebabkartan AB</p>
                <p className="text-slate-700">
                  E-post:{' '}
                  <a href="mailto:kontakt@kebabkartan.se" className="text-primary hover:underline">
                    kontakt@kebabkartan.se
                  </a>
                </p>
                <p className="text-slate-700 mt-4 text-sm">
                  Du har också rätt att lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY) om du anser
                  att vår behandling av dina personuppgifter bryter mot GDPR.
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
