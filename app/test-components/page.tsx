'use client';

import React, { useState } from 'react';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import RatingInput from '@/app/components/ui/RatingInput';
import DualRatingInput from '@/app/components/ui/DualRatingInput';
import ReviewCard from '@/app/components/ui/ReviewCard';
import RestaurantCard from '@/app/components/ui/RestaurantCard';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';
import { MaterialIcon } from '@/app/components/Icons';

/**
 * Component Test Page
 * Used for visual testing with Playwright MCP
 * Access at: http://localhost:3000/test-components
 */
export default function TestComponentsPage() {
  const [count, setCount] = useState(0);
  const [generalRating, setGeneralRating] = useState(0);
  const [sauceRating, setSauceRating] = useState(0);
  const [simpleRating, setSimpleRating] = useState(0);
  const [review1Liked, setReview1Liked] = useState(false);
  const [review1Likes, setReview1Likes] = useState(12);
  const [review2Liked, setReview2Liked] = useState(true);
  const [review2Likes, setReview2Likes] = useState(8);

  const handleReview1Like = () => {
    setReview1Liked(!review1Liked);
    setReview1Likes(review1Liked ? review1Likes - 1 : review1Likes + 1);
  };

  const handleReview2Like = () => {
    setReview2Liked(!review2Liked);
    setReview2Likes(review2Liked ? review2Likes - 1 : review2Likes + 1);
  };

  return (
    <>
      {/* Header Examples */}
      <div className="mb-4">
        <Header
          isLoggedIn={false}
          onLoginClick={() => alert('Login clicked')}
          onSearch={(query) => alert(`Searching for: ${query}`)}
        />
      </div>

      <div className="min-h-screen bg-background-light p-8 pb-24">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Component Test Page
            </h1>
            <p className="text-slate-500">
              Visual testing for kebabkartan.se components
            </p>
          </div>

          {/* Header Component Tests */}
          <section className="bg-white rounded-2xl p-8 shadow-card">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Header & Navigation Components
            </h2>

            <div className="space-y-8">
              {/* Header Variants */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Header - Logged Out
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Header
                    isLoggedIn={false}
                    onLoginClick={() => alert('Login clicked')}
                    onSearch={(query) => alert(`Searching for: ${query}`)}
                    variant="solid"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Header - Logged In
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Header
                    isLoggedIn={true}
                    userName="Erik Johansson"
                    onSearch={(query) => alert(`Searching for: ${query}`)}
                    onProfileClick={() => alert('Profile clicked')}
                    onLogoutClick={() => alert('Logout clicked')}
                    variant="solid"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Header - Without Search
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Header
                    isLoggedIn={true}
                    userName="Anna Svensson"
                    showSearch={false}
                    onProfileClick={() => alert('Profile clicked')}
                    onLogoutClick={() => alert('Logout clicked')}
                    variant="solid"
                  />
                </div>
              </div>

              {/* Bottom Navigation */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Bottom Navigation (Mobile)
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Resize browser to mobile width (&lt;768px) to see the bottom navigation, or view it in the preview below:
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden relative h-20 bg-white">
                  <BottomNavigation />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Bottom Navigation with Badges
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden relative h-20 bg-white">
                  <BottomNavigation
                    tabs={[
                      { id: 'explore', label: 'Utforska', icon: 'explore', href: '/' },
                      { id: 'suggest', label: 'Föreslå', icon: 'add_location', href: '/forslag', badge: 3 },
                      { id: 'profile', label: 'Profil', icon: 'person', href: '/profil', badge: 12 },
                    ]}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Bottom Navigation - 4 Tabs
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden relative h-20 bg-white">
                  <BottomNavigation
                    tabs={[
                      { id: 'home', label: 'Hem', icon: 'home', href: '/' },
                      { id: 'search', label: 'Sök', icon: 'search', href: '/sok' },
                      { id: 'favorites', label: 'Favoriter', icon: 'favorite', href: '/favoriter', badge: 5 },
                      { id: 'profile', label: 'Profil', icon: 'person', href: '/profil' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </section>

        {/* Restaurant Card Component Tests */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Restaurant Card Component
          </h2>

          <div className="space-y-8">
            {/* Default Variant */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Default Variant
              </h3>
              <div className="space-y-4">
                <RestaurantCard
                  id="1"
                  name="Pizzeria Istanbul"
                  address="Haga Nygata 15"
                  city="Göteborg"
                  rating={4.5}
                  sauceRating={4.8}
                  reviewCount={127}
                  distance={0.5}
                  priceRange="80-150"
                  isOpen={true}
                  slug="restaurang/pizzeria-istanbul-goteborg"
                />
                <RestaurantCard
                  id="2"
                  name="Kebab King"
                  address="Vasagatan 22"
                  city="Stockholm"
                  rating={3.8}
                  sauceRating={4.2}
                  reviewCount={89}
                  distance={1.2}
                  priceRange="90-160"
                  isOpen={false}
                />
                <RestaurantCard
                  id="3"
                  name="Falafel House"
                  address="Möllevångstorget 8"
                  city="Malmö"
                  rating={4.9}
                  sauceRating={5.0}
                  reviewCount={234}
                  distance={0.3}
                  priceRange="70-130"
                  isOpen={true}
                />
              </div>
            </div>

            {/* Compact Variant */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Compact Variant (for Lists)
              </h3>
              <div className="space-y-2">
                <RestaurantCard
                  id="4"
                  name="Döner Express"
                  address="Storgatan 45"
                  rating={4.2}
                  sauceRating={3.9}
                  reviewCount={56}
                  distance={0.8}
                  variant="compact"
                />
                <RestaurantCard
                  id="5"
                  name="Shawarma Station"
                  address="Kungsgatan 12"
                  rating={3.5}
                  sauceRating={3.8}
                  reviewCount={42}
                  distance={1.5}
                  variant="compact"
                />
                <RestaurantCard
                  id="6"
                  name="Gyros Grill"
                  address="Avenyn 78"
                  rating={4.7}
                  sauceRating={4.5}
                  reviewCount={98}
                  distance={2.1}
                  variant="compact"
                />
              </div>
            </div>

            {/* Featured Variant */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Featured Variant (with Images)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RestaurantCard
                  id="7"
                  name="Sultans Kebab"
                  address="Järntorget 3"
                  city="Göteborg"
                  rating={4.8}
                  sauceRating={4.9}
                  reviewCount={189}
                  distance={0.6}
                  priceRange="95-175"
                  imageUrl="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop"
                  variant="featured"
                />
                <RestaurantCard
                  id="8"
                  name="Anatolian Kitchen"
                  address="Linnégatan 45"
                  city="Stockholm"
                  rating={4.6}
                  sauceRating={4.7}
                  reviewCount={156}
                  distance={1.8}
                  priceRange="100-180"
                  imageUrl="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop"
                  variant="featured"
                />
              </div>
            </div>

            {/* Different Ratings */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Different Rating Scenarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RestaurantCard
                  id="9"
                  name="Perfekt Kebab"
                  address="Drottninggatan 99"
                  rating={5.0}
                  sauceRating={5.0}
                  reviewCount={412}
                  distance={0.4}
                  priceRange="110-190"
                  isOpen={true}
                />
                <RestaurantCard
                  id="10"
                  name="Kebab Corner"
                  address="Stortorget 5"
                  rating={2.5}
                  sauceRating={2.8}
                  reviewCount={23}
                  distance={3.2}
                  priceRange="60-120"
                  isOpen={false}
                />
                <RestaurantCard
                  id="11"
                  name="Golden Grill"
                  address="Norra Hamngatan 18"
                  rating={3.0}
                  sauceRating={4.5}
                  reviewCount={67}
                  distance={1.1}
                  priceRange="85-140"
                />
                <RestaurantCard
                  id="12"
                  name="Istanbul Express"
                  address="Södra Vägen 32"
                  rating={4.3}
                  sauceRating={3.2}
                  reviewCount={91}
                  distance={0.9}
                  priceRange="75-135"
                />
              </div>
            </div>

            {/* Without Images (Default Icons) */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Without Images (Icon Fallback)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RestaurantCard
                  id="13"
                  name="Quick Kebab"
                  address="Centralstationen"
                  rating={3.8}
                  sauceRating={3.5}
                  reviewCount={34}
                  distance={0.2}
                  variant="compact"
                />
                <RestaurantCard
                  id="14"
                  name="City Grill"
                  address="Hamngatan 12"
                  rating={4.1}
                  sauceRating={4.0}
                  reviewCount={78}
                  distance={0.7}
                  variant="compact"
                />
                <RestaurantCard
                  id="15"
                  name="Kebab House"
                  address="Avenyn 101"
                  rating={4.4}
                  sauceRating={4.6}
                  reviewCount={145}
                  distance={1.3}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Button Component Tests */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Button Component
          </h2>

          {/* Variants */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Variants
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="success">Success Button</Button>
                <Button variant="warning">Warning Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm" variant="primary">Small Button</Button>
                <Button size="md" variant="primary">Medium Button</Button>
                <Button size="lg" variant="primary">Large Button</Button>
              </div>
            </div>

            {/* With Icons (Material Symbols) */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                With Material Icons
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" icon="restaurant">
                  Visa restaurang
                </Button>
                <Button variant="success" icon="check_circle">
                  Godkänn
                </Button>
                <Button variant="danger" icon="delete">
                  Radera
                </Button>
                <Button variant="outline" icon="edit">
                  Redigera
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                States
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Normal</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" isLoading>
                  Loading
                </Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Full Width
              </h3>
              <Button variant="primary" fullWidth icon="restaurant">
                Skriv recension
              </Button>
            </div>

            {/* Interactive Test */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Interactive Test
              </h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="primary"
                  icon="add"
                  onClick={() => setCount(count + 1)}
                  id="increment-button"
                >
                  Increment
                </Button>
                <span className="text-2xl font-bold text-slate-900" id="counter-display">
                  {count}
                </span>
                <Button
                  variant="danger"
                  icon="remove"
                  onClick={() => setCount(Math.max(0, count - 1))}
                  id="decrement-button"
                >
                  Decrement
                </Button>
                <Button
                  variant="outline"
                  icon="refresh"
                  onClick={() => setCount(0)}
                  id="reset-button"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Swedish Text Examples */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Swedish Text Examples
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" icon="login">Logga in</Button>
                <Button variant="primary" icon="person_add">Skapa konto</Button>
                <Button variant="outline" icon="search">Sök restaurang</Button>
                <Button variant="success" icon="favorite">Spara favorit</Button>
                <Button variant="ghost" icon="close">Stäng</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Review Card Component Tests */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Review Card Component
          </h2>

          <div className="space-y-6">
            {/* Complete Review */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Complete Review with All Features
              </h3>
              <ReviewCard
                userName="Erik Johansson"
                generalRating={5}
                sauceRating={4}
                generalText="Fantastisk kebab! Perfekt kryddning och färskt kött. Brödet var varmt och gott. Kommer definitivt tillbaka hit igen. Servicen var också toppenklass!"
                sauceText="Såsen var riktigt bra, mild vitlökssås med perfekt konsistens. Skulle dock vilja ha lite mer hetta, därför 4 stjärnor."
                likes={review1Likes}
                isLiked={review1Liked}
                onLike={handleReview1Like}
                createdAt={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()}
                isEdited={false}
                isOwner={false}
              />
            </div>

            {/* Owner Review with Actions */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Owner Review (with Edit/Delete)
              </h3>
              <ReviewCard
                userName="Anna Svensson"
                generalRating={4}
                sauceRating={5}
                generalText="Mycket bra kebab överlag. Lite långsam service men maten var värd väntan."
                sauceText="Såsen var FANTASTISK! Bästa såsen jag smakat på länge. Hemgjord och krämig!"
                likes={review2Likes}
                isLiked={review2Liked}
                onLike={handleReview2Like}
                createdAt={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}
                isEdited={true}
                isOwner={true}
                onEdit={() => alert('Redigera recension')}
                onDelete={() => alert('Ta bort recension')}
              />
            </div>

            {/* Minimal Review (no text) */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Minimal Review (ratings only)
              </h3>
              <ReviewCard
                userName="Mohammed Ali"
                generalRating={3}
                sauceRating={3}
                likes={5}
                isLiked={false}
                onLike={() => {}}
                createdAt={new Date().toISOString()}
              />
            </div>

            {/* Different Time Periods */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Different Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewCard
                  userName="Lisa Andersson"
                  generalRating={5}
                  sauceRating={5}
                  generalText="Perfekt!"
                  likes={2}
                  createdAt={new Date().toISOString()}
                />
                <ReviewCard
                  userName="Johan Berg"
                  generalRating={4}
                  sauceRating={3}
                  generalText="Helt okej, inget speciellt."
                  likes={0}
                  createdAt={new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()}
                />
                <ReviewCard
                  userName="Maria Karlsson"
                  generalRating={2}
                  sauceRating={1}
                  generalText="Tyvärr inte så bra. Kallt och tråkigt."
                  likes={3}
                  createdAt={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}
                />
                <ReviewCard
                  userName="Peter Nilsson"
                  generalRating={5}
                  sauceRating={4}
                  generalText="Mysigt ställe med god mat!"
                  sauceText="Såsen kunde varit starkare."
                  likes={15}
                  isLiked={true}
                  createdAt={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()}
                />
              </div>
            </div>

            {/* Extreme Ratings */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Extreme Ratings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewCard
                  userName="Kebab Lover"
                  generalRating={5}
                  sauceRating={5}
                  generalText="BÄSTA KEBABEN I HELA SVERIGE! Åker 50 km för att äta här. Helt magiskt!"
                  sauceText="Såsen är gudomlig! Deras hemliga recept måste delas med världen!"
                  likes={99}
                  isLiked={true}
                  createdAt={new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()}
                />
                <ReviewCard
                  userName="Besviken Kund"
                  generalRating={1}
                  sauceRating={1}
                  generalText="Väldigt besviken. Köttet var torrt och brödet var gammalt. Kommer aldrig hit igen."
                  sauceText="Såsen smakade ingenting. Som vatten med lite vitlök."
                  likes={4}
                  isLiked={false}
                  createdAt={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Rating Component Tests */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Rating Components
          </h2>

          <div className="space-y-8">
            {/* Simple Rating Input */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Simple Rating Input
              </h3>
              <div className="space-y-4">
                <RatingInput
                  label="Betyg"
                  value={simpleRating}
                  onChange={setSimpleRating}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RatingInput
                    label="Small"
                    value={simpleRating}
                    onChange={setSimpleRating}
                    size="sm"
                  />
                  <RatingInput
                    label="Medium"
                    value={simpleRating}
                    onChange={setSimpleRating}
                    size="md"
                  />
                  <RatingInput
                    label="Large"
                    value={simpleRating}
                    onChange={setSimpleRating}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Dual Rating Input - Card Variant */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Dual Rating (Card Variant)
              </h3>
              <DualRatingInput
                generalRating={generalRating}
                sauceRating={sauceRating}
                onGeneralRatingChange={setGeneralRating}
                onSauceRatingChange={setSauceRating}
                variant="card"
              />
            </div>

            {/* Dual Rating Input - Inline Variant */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Dual Rating (Inline Variant)
              </h3>
              <DualRatingInput
                generalRating={generalRating}
                sauceRating={sauceRating}
                onGeneralRatingChange={setGeneralRating}
                onSauceRatingChange={setSauceRating}
                variant="inline"
              />
            </div>

            {/* Rating States */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Rating States
              </h3>
              <div className="space-y-4">
                <RatingInput
                  label="Normal"
                  value={3}
                  onChange={() => {}}
                />
                <RatingInput
                  label="With Helper Text"
                  value={4}
                  onChange={() => {}}
                  helperText="Välj ett betyg mellan 1-5 stjärnor"
                />
                <RatingInput
                  label="With Error"
                  value={0}
                  onChange={() => {}}
                  error="Du måste välja ett betyg"
                  required
                />
                <RatingInput
                  label="Disabled"
                  value={5}
                  onChange={() => {}}
                  disabled
                />
              </div>
            </div>

            {/* Heart Variant */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Heart Variant (for Sås)
              </h3>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <RatingInput
                  label="Såsbetyg"
                  value={sauceRating}
                  onChange={setSauceRating}
                  variant="heart"
                  helperText="Hur var såsen?"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Input Component Tests */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Input Component
          </h2>

          {/* Variants */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Variants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Default variant" variant="default" />
                <Input placeholder="Filled variant" variant="filled" />
                <Input placeholder="Outlined variant" variant="outlined" />
              </div>
            </div>

            {/* With Labels */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                With Labels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Användarnamn" placeholder="Skriv ditt användarnamn" />
                <Input label="E-post" placeholder="din@email.com" type="email" />
              </div>
            </div>

            {/* With Material Icons */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                With Material Icons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input icon="search" placeholder="Sök restaurang..." />
                <Input icon="person" label="Användarnamn" placeholder="dittnamn" />
                <Input icon="mail" label="E-post" placeholder="din@email.com" type="email" />
                <Input icon="lock" label="Lösenord" placeholder="••••••••" type="password" />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Sizes
              </h3>
              <div className="space-y-3">
                <Input size="sm" placeholder="Small input" icon="search" />
                <Input size="md" placeholder="Medium input" icon="search" />
                <Input size="lg" placeholder="Large input" icon="search" />
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                States
              </h3>
              <div className="space-y-3">
                <Input label="Normal" placeholder="Normal input" icon="edit" />
                <Input
                  label="With Helper Text"
                  placeholder="Enter your username"
                  helperText="Användarnamnet måste vara minst 3 tecken långt"
                  icon="person"
                />
                <Input
                  label="With Error"
                  placeholder="Enter valid email"
                  error="Ogiltig e-postadress"
                  icon="mail"
                />
                <Input label="Disabled" placeholder="Disabled input" disabled icon="block" />
              </div>
            </div>

            {/* Swedish Examples */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                Swedish Form Examples
              </h3>
              <div className="space-y-3">
                <Input label="Restaurangnamn" placeholder="Pizza Nisses" icon="restaurant" />
                <Input label="Stad" placeholder="Stockholm" icon="location_on" />
                <Input label="Betyg (1-5)" placeholder="5" type="number" min="1" max="5" icon="star" />
                <Input
                  label="Recension"
                  placeholder="Skriv din recension här..."
                  helperText="Dela med dig av din upplevelse"
                  icon="rate_review"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Design System Info */}
        <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Design System Reference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Primary Color</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary shadow-sm"></div>
                <code className="text-xs">#D97706</code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Typography</h3>
              <p className="text-sm">Plus Jakarta Sans</p>
              <p className="text-xs text-slate-500">Weights: 400-800</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Icons</h3>
              <p className="text-sm">Material Symbols Outlined</p>
              <div className="flex gap-2 mt-2">
                <MaterialIcon name="restaurant" />
                <MaterialIcon name="star" fill />
                <MaterialIcon name="favorite" fill />
              </div>
            </div>
          </div>
        </section>

        </div>
      </div>

      {/* Bottom Navigation (visible on mobile) */}
      <BottomNavigation />
    </>
  );
}
