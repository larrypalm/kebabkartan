import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';
import { Footer } from '@/app/components/layout/Footer';
import { MaterialIcon } from '@/app/components/Icons';

export const metadata: Metadata = {
  title: 'Topplistor | Kebabkartan',
  description: 'Upptäck Sveriges bästa kebab, pizza och falafel. Se topplistor baserade på betyg, såsbetyg och stad.',
  openGraph: {
    title: 'Topplistor | Kebabkartan',
    description: 'Upptäck Sveriges bästa kebab, pizza och falafel. Se topplistor baserade på betyg, såsbetyg och stad.',
  },
};

const cities = [
  { name: 'Stockholm', slug: 'stockholm' },
  { name: 'Göteborg', slug: 'goteborg' },
  { name: 'Malmö', slug: 'malmo' },
  { name: 'Jönköping', slug: 'jonkoping' },
  { name: 'Linköping', slug: 'linkoping' },
  { name: 'Lund', slug: 'lund' },
];

export default function TopplistorPage() {
  return (
    <>
      <Header showSearch={false} />

      <main role="main" className="relative bg-background-light min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <a href="/" className="hover:text-primary transition-colors">
                Kebabkartan.se
              </a>
              <span>/</span>
              <span className="text-slate-900 font-medium">Topplistor</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              <span className="text-primary">Topplistor</span> - Sveriges Bästa Kebab
            </h1>
            <p className="text-base md:text-lg text-text-muted mb-6 max-w-3xl">
              Upptäck de högst rankade restaurangerna i Sverige baserat på användarrecensioner och betyg.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Overall and Sauce Rating Lists */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Nationella Topplistor</h2>

              {/* Overall Rating */}
              <Link
                href="/topplistor/topp-betyg"
                className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all border border-slate-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <MaterialIcon name="star" fill className="text-primary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Högsta Totalbetyg
                    </h3>
                    <p className="text-text-muted">
                      Sveriges bästa restauranger baserat på totalbetyg från användare
                    </p>
                  </div>
                  <MaterialIcon name="arrow_forward" className="text-slate-400" />
                </div>
              </Link>

              {/* Sauce Rating */}
              <Link
                href="/topplistor/topp-sas"
                className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all border border-slate-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 rounded-xl p-3">
                    <MaterialIcon name="favorite" fill className="text-secondary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Bästa Såsbetyg
                    </h3>
                    <p className="text-text-muted">
                      Restauranger med de högst rankade såserna i Sverige
                    </p>
                  </div>
                  <MaterialIcon name="arrow_forward" className="text-slate-400" />
                </div>
              </Link>
            </div>

            {/* City Top Lists */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Topplistor per Stad</h2>
              <div className="space-y-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/topplistor/${city.slug}`}
                    className="block bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all border border-slate-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MaterialIcon name="location_city" className="text-primary" />
                        <span className="font-medium text-slate-900">{city.name}</span>
                      </div>
                      <MaterialIcon name="arrow_forward" className="text-slate-400" size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </>
  );
}
