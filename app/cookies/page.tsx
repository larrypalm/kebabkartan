'use client';

import Link from 'next/link';
import Header from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import BottomNavigation from '@/app/components/layout/BottomNavigation';

export default function CookiesPage() {
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
              Cookiepolicy
            </h1>
            <p className="text-lg text-text-muted">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Vad är cookies?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Cookies är små textfiler som lagras på din enhet (dator, surfplatta, mobiltelefon) när du besöker
                en webbplats. De hjälper webbplatsen att komma ihåg information om ditt besök, som dina preferenser
                och inloggningsuppgifter, vilket gör nästa besök enklare och webbplatsen mer användbar för dig.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Kebabkartan AB ("vi", "oss", "vår") använder cookies och liknande tekniker på kebabkartan.se
                ("Webbplatsen"). Denna policy förklarar vilka cookies vi använder, varför vi använder dem och hur
                du kan hantera dina cookie-preferenser.
              </p>
            </section>

            {/* Types of cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Typer av cookies</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Efter syfte</h3>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Nödvändiga cookies (Essential)</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Dessa cookies är nödvändiga för att Webbplatsen ska fungera korrekt. De möjliggör grundläggande
                    funktioner som sidnavigering, säker inloggning och åtkomst till säkra områden. Webbplatsen kan
                    inte fungera korrekt utan dessa cookies.
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    <strong>Exempel:</strong> Sessionscookies, autentiseringscookies, säkerhetscookies
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Funktionella cookies (Functional)</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Dessa cookies gör det möjligt för Webbplatsen att komma ihåg val du gör (som ditt användarnamn,
                    språk eller region) och tillhandahålla förbättrade, mer personliga funktioner.
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    <strong>Exempel:</strong> Språkval, temainställningar (mörkt läge), kartposition
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Prestanda- och analyticscookies (Analytics)</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Dessa cookies hjälper oss att förstå hur besökare interagerar med Webbplatsen genom att samla
                    in och rapportera information anonymt. Detta hjälper oss att förbättra hur Webbplatsen fungerar.
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    <strong>Exempel:</strong> Google Analytics cookies (_ga, _gid, _gat)
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Marknadsföringscookies (Marketing)</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Dessa cookies används för att spåra besökare över webbplatser. Avsikten är att visa annonser som
                    är relevanta och engagerande för den enskilda användaren.
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    <strong>Status:</strong> Vi använder för närvarande inga marknadsföringscookies.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.2 Efter varaktighet</h3>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Sessionscookies</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Tillfälliga cookies som raderas när du stänger din webbläsare. De används för att hålla dig
                    inloggad under din session och för grundläggande funktionalitet.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Beständiga cookies (Persistent)</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Cookies som förblir på din enhet under en fastställd period eller tills du raderar dem manuellt.
                    De används för att komma ihåg dina preferenser och inloggningsinformation.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies we use */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Cookies vi använder</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Cookie-namn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Typ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Syfte
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Varaktighet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {/* Authentication cookies */}
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <code className="bg-slate-100 px-2 py-1 rounded">CognitoIdentityServiceProvider.*</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">Nödvändig</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        AWS Cognito autentiseringstokens för inloggning och sessionshantering
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">30 dagar</td>
                    </tr>

                    {/* Google Analytics */}
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <code className="bg-slate-100 px-2 py-1 rounded">_ga</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">Analytics</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        Google Analytics - Skiljer användare åt för besöksstatistik
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">2 år</td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <code className="bg-slate-100 px-2 py-1 rounded">_gid</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">Analytics</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        Google Analytics - Skiljer användare åt för besöksstatistik
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">24 timmar</td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <code className="bg-slate-100 px-2 py-1 rounded">_gat</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">Analytics</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        Google Analytics - Begränsar förfrågningar (throttling)
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">1 minut</td>
                    </tr>

                    {/* Preferences */}
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <code className="bg-slate-100 px-2 py-1 rounded">theme</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">Funktionell</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        Sparar val av tema (ljust/mörkt läge)
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">1 år</td>
                    </tr>

                    {/* Cookie consent */}
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <code className="bg-slate-100 px-2 py-1 rounded">cookie_consent</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">Nödvändig</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        Sparar dina cookie-preferenser
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">1 år</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Third party cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Tredjepartscookies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Vi använder tjänster från tredje part som kan placera cookies på din enhet:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-primary bg-slate-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Google Analytics</h4>
                  <p className="text-slate-700 text-sm leading-relaxed mb-2">
                    Vi använder Google Analytics för att analysera hur användare interagerar med Webbplatsen.
                    Google Analytics samlar in information anonymt och rapporterar trender utan att identifiera
                    enskilda besökare.
                  </p>
                  <p className="text-slate-600 text-xs">
                    Läs mer:{' '}
                    <a
                      href="https://policies.google.com/technologies/cookies"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Googles cookie-policy
                    </a>
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-slate-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Google reCAPTCHA</h4>
                  <p className="text-slate-700 text-sm leading-relaxed mb-2">
                    Vi använder Google reCAPTCHA v3 för att skydda mot spam och automatiserade attacker.
                    reCAPTCHA samlar in hårdvaru- och programvaruinformation samt användarinteraktioner
                    för att bedöma säkerhetsrisker.
                  </p>
                  <p className="text-slate-600 text-xs">
                    Läs mer:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Googles integritetspolicy
                    </a>
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-slate-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">AWS Cognito</h4>
                  <p className="text-slate-700 text-sm leading-relaxed mb-2">
                    AWS Cognito hanterar användarautentisering och säkerhet. Cognito använder cookies för att
                    hantera användarsessioner säkert.
                  </p>
                  <p className="text-slate-600 text-xs">
                    Läs mer:{' '}
                    <a
                      href="https://aws.amazon.com/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      AWS Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-slate-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">OpenStreetMap</h4>
                  <p className="text-slate-700 text-sm leading-relaxed mb-2">
                    Våra kartor tillhandahålls av OpenStreetMap. När du använder kartan kan OpenStreetMap
                    samla in viss data för att leverera karttjänster.
                  </p>
                  <p className="text-slate-600 text-xs">
                    Läs mer:{' '}
                    <a
                      href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      OpenStreetMap Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Managing cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Hantera cookies</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Cookie-inställningar på Webbplatsen</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                När du besöker Webbplatsen första gången visas en cookie-banner där du kan välja att acceptera
                eller avvisa icke-nödvändiga cookies. Du kan när som helst ändra dina preferenser.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                <p className="text-slate-700 mb-4 font-medium">
                  Vill du ändra dina cookie-inställningar?
                </p>
                <button
                  onClick={() => {
                    // This would trigger cookie settings modal
                    // For now, just a placeholder
                    alert('Cookie-inställningar kommer snart! För närvarande kan du hantera cookies via din webbläsare.');
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Öppna cookie-inställningar
                </button>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Webbläsarinställningar</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                De flesta webbläsare tillåter dig att kontrollera cookies via inställningarna. Du kan:
              </p>
              <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-2 mb-4">
                <li>Blockera alla cookies</li>
                <li>Endast tillåta cookies från webbplatser du besöker</li>
                <li>Radera cookies när du stänger webbläsaren</li>
                <li>Få en varning innan cookies lagras</li>
              </ul>

              <p className="text-slate-700 leading-relaxed mb-4">
                Här är länkar till cookie-instruktioner för populära webbläsare:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700 text-sm">Google Chrome →</span>
                </a>
                <a
                  href="https://support.mozilla.org/sv/kb/webbplatscookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700 text-sm">Firefox →</span>
                </a>
                <a
                  href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700 text-sm">Safari →</span>
                </a>
                <a
                  href="https://support.microsoft.com/sv-se/microsoft-edge/radera-cookies-i-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="text-slate-700 text-sm">Microsoft Edge →</span>
                </a>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-900 text-sm leading-relaxed">
                  <strong>Observera:</strong> Om du blockerar eller raderar vissa cookies kanske vissa delar av
                  Webbplatsen inte fungerar korrekt. Du kan behöva logga in igen och vissa preferenser kan gå förlorade.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.3 Opt-out från Google Analytics</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Du kan förhindra att Google Analytics samlar in data genom att installera
                Google Analytics Opt-out Browser Add-on:
              </p>
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Ladda ner Google Analytics Opt-out Add-on →
              </a>
            </section>

            {/* Do Not Track */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. "Do Not Track" (DNT)</h2>
              <p className="text-slate-700 leading-relaxed">
                Vissa webbläsare har en "Do Not Track" (DNT)-funktion som signalerar till webbplatser att du
                inte vill bli spårad. För närvarande finns ingen enhetlig standard för hur DNT-signaler ska
                tolkas. Vi respekterar dock ditt val om du använder verktyg för att blockera cookies eller
                spårning.
              </p>
            </section>

            {/* Changes to policy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Ändringar av cookiepolicyn</h2>
              <p className="text-slate-700 leading-relaxed">
                Vi kan uppdatera denna cookiepolicy från tid till annan för att återspegla ändringar i vår
                användning av cookies eller av juridiska skäl. Vi kommer att meddela dig om väsentliga ändringar
                genom att publicera den nya policyn på denna sida och uppdatera "Senast uppdaterad"-datumet.
                Du uppmanas att granska denna policy regelbundet.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Kontakta oss</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Om du har frågor om vår användning av cookies eller denna cookiepolicy, kontakta oss:
              </p>

              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700 font-semibold mb-2">Kebabkartan AB</p>
                <p className="text-slate-700">
                  E-post:{' '}
                  <a href="mailto:kontakt@kebabkartan.se" className="text-primary hover:underline">
                    kontakt@kebabkartan.se
                  </a>
                </p>
                <p className="text-slate-700 mt-2">
                  Läs också vår{' '}
                  <Link href="/integritetspolicy" className="text-primary hover:underline">
                    integritetspolicy
                  </Link>
                  {' '}för mer information om hur vi hanterar dina personuppgifter.
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
