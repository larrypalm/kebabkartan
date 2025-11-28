# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kebabkartan.se** - Sveriges bästa guide till kebab, pizza & falafel! A Next.js application for discovering and rating restaurants across Sweden with a unique dual rating system (General + Sås/Sauce ratings).

## Development Commands

### Essential Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run lint` - Run ESLint for code quality checks
- `npm start` - Start production server

### AWS & Infrastructure

- Infrastructure code is in `/infrastructure/` using AWS CDK
- Amplify configuration in `/amplify/`
- **Important**: Infrastructure files are excluded from Next.js build (see `next.config.js`)

## ⚠️ CRITICAL: Build Check Before Completing Tasks

**ALWAYS run the production build check before marking any task as complete:**

```bash
nvm use && npm run build
```

This is **MANDATORY** for any code changes, especially:
- Creating or modifying pages (`.tsx` files in `app/`)
- Adding new components
- Changing imports or dependencies
- Modifying TypeScript types
- Any front-end code changes

**Why this matters:**
- Next.js has strict rules about Server vs Client Components
- Build-time errors won't appear in dev mode (`npm run dev`)
- A failing build means the code cannot be deployed
- Catching errors early saves time and prevents broken deployments

**Common build errors to watch for:**
- Event handlers in Server Components (need `'use client'` directive)
- Missing imports or type errors
- Metadata exports in Client Components (not allowed)
- Invalid component patterns

**If build fails:**
1. Read the error message carefully
2. Fix the issue (usually needs `'use client'` or type fixes)
3. Run `npm run build` again to verify
4. Only mark task complete when build succeeds

## Architecture Overview

### Core Technology Stack

- **Framework**: Next.js 14.2.26 with App Router and TypeScript 5.9.2
- **Database**: AWS DynamoDB (direct SDK integration, not Amplify Data)
- **Authentication**: AWS Cognito via Amplify 6.15.6 (supports Google SSO)
- **Maps**: Leaflet.js 1.9.4 with react-leaflet and clustering
- **Styling**: Tailwind CSS 4.1.10 with custom design system
- **Typography**: Plus Jakarta Sans (weights 400-800)
- **Icons**: Material Symbols Outlined (primary), Lucide React (legacy support)
- **Bot Protection**: Google reCAPTCHA v3
- **Analytics**: Google Analytics 4
- **Image Optimization**: Sharp

### Design System

**Colors:**
```javascript
primary: '#D97706'        // Warm amber (main brand color)
secondary: '#EA580C'      // Vibrant orange
background-light: '#F7F5F2'
surface: '#FFFFFF'
text-primary: '#1F2937'
text-muted: '#6B7280'
success: '#10B981'
warning: '#F59E0B'
error: '#EF4444'
```

**Dark Mode Support:**
- Enabled via `class` strategy
- Light mode is default
- Dark theme colors defined in Tailwind config

**Typography:**
- Font: Plus Jakarta Sans via Google Fonts
- CSS Variable: `--font-plus-jakarta`
- Display & body use same font family

**Shadows:**
- `shadow-card`: 0 2px 8px rgba(0,0,0,0.05)
- `shadow-card-hover`: 0 4px 12px rgba(0,0,0,0.08)
- `shadow-card-lg`: 0 8px 24px rgba(0,0,0,0.1)

### Database Schema (DynamoDB)

**Restaurants Table:**
```typescript
{
  id: string (UUID)
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number          // General rating (1-5)
  sauceRating: number     // Sås rating (1-5)
  totalVotes: number
  reviewCount: number
  slug: string            // SEO-friendly URL (restaurang/name-city)
  city?: string
  openingHours?: string
  priceRange?: string     // "$", "$$", "$$$"
  phone?: string
  tags?: string[]
  createdAt: ISO timestamp
  updatedAt: ISO timestamp
}
```

**Reviews Table** (to be implemented):
```typescript
{
  id: string
  restaurantId: string
  userId: string
  username: string
  generalRating: number (1-5)
  sauceRating: number (1-5)
  generalText?: string
  sauceText?: string
  likes: number
  likedBy: string[]
  isEdited: boolean
  createdAt: string
  editedAt?: string
}
```

**User Profiles Table** (to be implemented):
```typescript
{
  userId: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  reviewCount: number
  saucePoints: number  // Gamification
  followers: string[]
  following: string[]
  theme: 'light' | 'dark'
  createdAt: string
}
```

**Suggestions Table** (existing):
```typescript
{
  id: string
  userId: string
  name: string
  address: string
  latitude: number
  longitude: number
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  rejectionReason?: string
  createdAt: string
}
```

### App Structure

```
app/
├── (pages)/
│   ├── page.tsx                    # Homepage with map + list view
│   ├── restaurang/[id]/            # Restaurant detail pages (slug-based URLs)
│   ├── kebab-[city]/               # City-specific pages (Stockholm, Göteborg, etc.)
│   ├── auth/                       # Combined login/register
│   ├── my-account/                 # User account management
│   └── suggestions/                # Restaurant suggestion flow
├── admin/                          # Admin dashboard
│   ├── page.tsx                    # Admin overview
│   ├── suggestions/                # Moderate suggestions
│   └── restaurang/                 # Manage restaurants
├── api/                            # API routes
│   ├── kebab-places/route.ts      # GET/POST restaurants
│   ├── ratings/                    # Rating submission
│   ├── suggestions/                # Suggestion CRUD
│   └── user-votes/                 # Track individual votes
├── components/                     # Shared components
│   ├── ui/                         # UI primitives (Button, Card, Input, etc.)
│   ├── Map.tsx                     # Main map component (1,082 lines)
│   ├── Header.tsx                  # Navigation header
│   └── Icons.tsx                   # Icon system (Material + Lucide)
├── contexts/                       # React contexts
│   ├── AuthContext.tsx             # AWS Cognito auth state
│   └── MobileMenuContext.tsx       # Mobile menu state
├── lib/                            # Utilities
│   ├── slugUtils.ts                # URL slug generation
│   └── getKebabPlaces.ts           # DynamoDB data fetching
├── types/                          # TypeScript definitions
│   └── index.ts                    # All type definitions
└── utils/                          # Utility functions
    ├── analytics.ts                # GA4 tracking (15+ events)
    └── metadata.ts                 # SEO helpers
```

### Authentication Flow

1. **AWS Amplify + Cognito**: Configured in `AmplifyProvider` wrapper
2. **Auth Context**: `AuthContext.tsx` manages user state globally
3. **Supported Methods**:
   - Email/Password (Cognito)
   - Google SSO (configured in Amplify)
4. **Session Management**:
   - Automatic token refresh via Amplify Hub
   - No periodic polling (relies on Hub events)
5. **Protected Routes**: Manual checks using `useAuth()` hook

### Key Features

#### Dual Rating System
- **General Rating**: Overall experience (1-5 stars)
- **Sås Rating**: Sauce quality (1-5 stars)
- Both ratings are separate and displayed together

#### Map Integration
- **Leaflet.js** with OpenStreetMap tiles
- Custom markers showing sauce ratings
- Marker clustering for performance
- Custom popups with restaurant info
- Mobile-optimized controls

#### SEO Optimization
- **Slug-based URLs**: `/restaurang/pizza-nisses-stockholm` instead of UUIDs
- Server-side metadata generation
- Structured data (Schema.org)
- Open Graph tags
- Swedish character handling (å→a, ä→a, ö→o)
- Dynamic sitemaps (to be implemented)

#### City Pages
6 city-specific landing pages:
- Stockholm
- Göteborg
- Malmö
- Jönköping
- Linköping
- Lund

Each with SEO-optimized content and targeted keywords.

## Design Reference Screenshots

**IMPORTANT**: Always refer to the design screenshots in `/context/` when implementing or modifying visual features. These are the authoritative design mockups from Google AI Studio.

### Available Design Screenshots

All screenshots are located in `/context/` directory:

#### Homepage Designs
- `homepage-desktop-map-view.png` - Desktop map view
- `homepage-desktop-map-view-marker-open.png` - Desktop with marker popup open
- `homepage-desktop-list-view.png` - Desktop list view
- `homepage-mobile-map-view.png` - Mobile map view
- `homepage-mobile-map-view-marker-open.png` - Mobile with marker popup
- `homepage-mobile-list-view.png` - Mobile list view

#### Restaurant Detail Page
- `restaurant-details-page-desktop.png` - Desktop restaurant detail page
- `restaurant-details-page-mobile.png` - Mobile restaurant detail page

#### City-Specific Landing Pages
- `city-specific-landing-page-desktop.png` - Desktop city page
- `city-specific-landing-page-mobile.png` - Mobile city page

#### Authentication Pages
- `login-page-desktop.png` - Desktop login page
- `login-page-mobile.png` - Mobile login page

#### Account Pages
- `my-account-page-desktop.png` - Desktop account dashboard
- `my-account-page-mobile.png` - Mobile account dashboard

### Design Implementation Guidelines

**Before implementing any visual feature:**
1. **Check the relevant screenshot** in `/context/`
2. **Match exact spacing, colors, typography** from the design
3. **Test on both desktop and mobile** viewports
4. **Use Playwright MCP** to take screenshots and compare with design mockups
5. **Verify interactive states** (hover, focus, active) match the design intent

**When design screenshots are missing:**
- Follow the established design system (colors, typography, spacing from Tailwind config)
- Maintain consistency with existing implemented components
- Use Material Symbols icons as primary icon set
- Follow Swedish language patterns

### Using Playwright for Design Verification

Compare implementation against design screenshots:

```javascript
// Navigate to page
mcp__playwright__browser_navigate("http://localhost:3000");

// Match viewport to design screenshot
mcp__playwright__browser_resize(1440, 900);  // Desktop
// OR
mcp__playwright__browser_resize(390, 844);   // Mobile

// Take screenshot
mcp__playwright__browser_take_screenshot();

// Manually compare with corresponding design file in /context/
```

## Key Patterns & Best Practices

### API Routes Pattern

All API routes follow this structure:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch data from DynamoDB
    const data = await fetchFromDynamoDB();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error message', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate admin password if needed
    if (body.adminPassword !== process.env.NEXT_PUBLIC_LAMBDA_PASSWORD) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // Process request
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
```

### Component Styling

**Always use Tailwind utilities** instead of inline styles:

```tsx
// ✅ GOOD - Tailwind utilities
<div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover">

// ❌ BAD - Inline styles (legacy pattern, avoid)
<div style={{ backgroundColor: 'white', borderRadius: '16px' }}>
```

**Material Symbols Icons:**

```tsx
import { MaterialIcon } from '@/app/components/Icons';

// Basic usage
<MaterialIcon name="restaurant" />

// With props
<MaterialIcon name="star" fill size="lg" className="text-primary" />

// Sizes: 'sm' (16px), 'md' (20px), 'lg' (24px), 'xl' (36px)
```

**Legacy Lucide Icons** (for backwards compatibility):

```tsx
import { Star, MapPin } from '@/app/components/Icons';

<Star className="w-5 h-5 text-primary" />
```

### Slug Generation

Always use utility functions for URL slugs:

```typescript
import { createSlug, createRestaurantSlug } from '@/app/lib/slugUtils';

// Generate slug from text
const slug = createSlug("Palmyra Kebab"); // "palmyra-kebab"

// Generate restaurant URL slug
const url = createRestaurantSlug("Pizza Nisses", "Stockholm");
// Result: "restaurang/pizza-nisses-stockholm"

// Swedish character handling is automatic
createSlug("Kärlekens Gård"); // "karlekens-gard"
```

### Type Imports

Use centralized types:

```typescript
import type {
  Restaurant,
  Review,
  UserProfile,
  Suggestion
} from '@/app/types';
```

### DynamoDB Access

```typescript
import { getKebabPlaces } from '@/lib/getKebabPlaces';

// Fetch all restaurants
const places = await getKebabPlaces();
```

**DynamoDB Client Pattern:**

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
```

### Analytics Tracking

Track user events using GA4:

```typescript
import { trackKebabPlaceView, trackRatingSubmitted } from '@/app/utils/analytics';

// Track restaurant view
trackKebabPlaceView(placeId, placeName, city);

// Track rating submission
trackRatingSubmitted(placeId, placeName, rating);
```

**Available tracking functions:**
- `trackKebabPlaceView`
- `trackRatingSubmitted`
- `trackSearch`
- `trackMarkerClick`
- `trackMapLoaded`
- And 10+ more...

### Error Handling

Show user-friendly errors:

```tsx
import { Alert } from '@/app/components/ui';

<Alert variant="error">
  Kunde inte ladda restauranger. Försök igen senare.
</Alert>
```

## Mobile Development

### Responsive Design

- **Mobile-first**: Base styles for 320-640px
- **Breakpoints**: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`, `2xl:1536px`
- **Safe areas**: Use `pb-safe` for iPhone notch handling
- **Touch targets**: Minimum 44x44px (iOS standard)

### Navigation Structure

**Desktop:**
- Top fixed header with navigation links
- Logo in header

**Mobile:**
- Top header (minimal)
- Bottom navigation (to be implemented):
  - 🍕 Utforska (Explore)
  - ➕ Föreslå (Suggest) - *User confirmed addition*
  - 👤 Profil (Profile)

### Mobile Menu

Legacy sidebar menu (will be replaced):
- Hamburger button triggers overlay sidebar
- Full-screen menu on mobile
- Managed by `MobileMenuContext`

## Content Guidelines

### Language

**All UI text must be in Swedish:**

```tsx
// ✅ GOOD
<button>Skriv recension</button>

// ❌ BAD
<button>Write review</button>
```

**Common Swedish Terms:**
- Restaurang = Restaurant
- Recension = Review
- Betyg = Rating
- Såsbetyg = Sauce rating
- Föreslå = Suggest
- Utforska = Explore
- Profil = Profile
- Ställen = Places
- Öppet = Open
- Stängt = Closed

### SEO Metadata

Follow the pattern in `app/utils/metadata.ts`:

```typescript
import { createPlaceTitle, createPlaceDescription } from '@/app/lib/slugUtils';

// Generate SEO-optimized title
const title = createPlaceTitle(place);
// Result: "🔥 Pizza Nisses | Bästa kebab i Stockholm | Kebabkartan"

const description = createPlaceDescription(place);
// Result: "Upptäck Pizza Nisses på Drottninggatan 5. Läs äkta recensioner..."
```

## Visual Development & Testing

### Design System Standards

The project follows modern SaaS design standards with mobile-first approach. All UI development must prioritize:

- **Pixel-perfect implementation** matching design mockups
- **Responsive design** from 320px (mobile) to 2560px (large desktop)
- **Accessibility** (WCAG 2.1 AA compliance minimum)
- **Performance** (smooth animations 150-300ms, fast load times)
- **Swedish language** consistency across all UI text

### Playwright MCP Integration

**Playwright MCP** is installed for automated browser testing and visual verification. Use it to ensure UI quality throughout development.

#### Essential Playwright Commands

```javascript
// Navigation & Page Loading
mcp__playwright__browser_navigate(url)              // Navigate to a page
mcp__playwright__browser_wait_for(selector)         // Wait for element to load

// Screenshots & Visual Verification
mcp__playwright__browser_take_screenshot()          // Capture full page screenshot
mcp__playwright__browser_resize(width, height)      // Test responsive layouts

// Interaction Testing
mcp__playwright__browser_click(selector)            // Click an element
mcp__playwright__browser_type(selector, text)       // Type into input fields
mcp__playwright__browser_hover(selector)            // Test hover states

// Debugging & Validation
mcp__playwright__browser_console_messages()         // Check for JavaScript errors
mcp__playwright__browser_snapshot()                 // Get accessibility tree
```

#### Responsive Testing Viewports

Test all UI changes at these key breakpoints:

```javascript
// Mobile
mcp__playwright__browser_resize(375, 812);   // iPhone standard
mcp__playwright__browser_resize(390, 844);   // iPhone 14 Pro
mcp__playwright__browser_resize(360, 740);   // Android standard

// Tablet
mcp__playwright__browser_resize(768, 1024);  // iPad portrait
mcp__playwright__browser_resize(1024, 768);  // iPad landscape

// Desktop
mcp__playwright__browser_resize(1440, 900);  // Standard desktop (design reference)
mcp__playwright__browser_resize(1920, 1080); // Full HD
```

### Quick Visual Check Protocol

**REQUIRED after every front-end change:**

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to affected page(s)**:
   ```javascript
   mcp__playwright__browser_navigate("http://localhost:3000");
   mcp__playwright__browser_navigate("http://localhost:3000/restaurang/test-slug");
   ```

3. **Test responsive views**:
   ```javascript
   // Mobile
   mcp__playwright__browser_resize(375, 812);
   mcp__playwright__browser_take_screenshot();

   // Desktop
   mcp__playwright__browser_resize(1440, 900);
   mcp__playwright__browser_take_screenshot();
   ```

4. **Check for errors**:
   ```javascript
   mcp__playwright__browser_console_messages();
   ```

5. **Verify interactive elements**:
   ```javascript
   mcp__playwright__browser_hover(".button-class");
   mcp__playwright__browser_click(".link-class");
   ```

6. **Test dark mode** (if applicable):
   ```javascript
   mcp__playwright__browser_click("#theme-toggle");
   mcp__playwright__browser_take_screenshot();
   ```

### Comprehensive UI Testing

For major features or before committing large changes:

1. **Test all breakpoints** (mobile, tablet, desktop)
2. **Verify all interactive states** (hover, focus, active, disabled)
3. **Check accessibility**:
   ```javascript
   mcp__playwright__browser_snapshot();
   ```
4. **Validate forms**:
   ```javascript
   mcp__playwright__browser_type("#email-input", "test@example.com");
   mcp__playwright__browser_click("#submit-button");
   ```
5. **Test navigation flows**:
   ```javascript
   mcp__playwright__browser_click(".nav-link");
   mcp__playwright__browser_wait_for(".page-content");
   ```
6. **Verify error states** (empty states, loading, errors)

### When to Use Visual Testing

#### ✅ Always Test (Quick Check):
- After creating/updating any component
- After modifying page layouts
- After styling changes (Tailwind classes, CSS)
- Before committing UI changes
- After fixing visual bugs

#### ✅ Comprehensive Testing Required:
- New page implementations
- Major component refactors
- Navigation changes
- Form implementations
- Responsive layout changes
- Accessibility improvements

#### ❌ Skip Visual Testing:
- API route changes (backend only)
- Database schema updates
- Utility function changes (non-visual)
- Configuration file updates
- Documentation updates

### Design Compliance Checklist

When implementing UI features, verify:

- [ ] **Visual Hierarchy**: Clear focus flow, appropriate spacing
- [ ] **Consistency**: Uses design tokens (colors, shadows, spacing from Tailwind config)
- [ ] **Responsiveness**: Tested at 375px, 768px, 1440px viewports
- [ ] **Typography**: Plus Jakarta Sans loaded correctly, proper font weights
- [ ] **Icons**: Material Symbols render correctly, proper size/color
- [ ] **Colors**: Matches design system (primary #D97706, etc.)
- [ ] **Accessibility**:
  - Keyboard navigable (Tab, Enter, Escape work)
  - Proper color contrast (use browser tools to verify)
  - Semantic HTML elements
  - ARIA labels where needed
- [ ] **Performance**:
  - No layout shift (CLS)
  - Smooth animations (60fps)
  - Fast load times
- [ ] **Interactive States**:
  - Hover effects work
  - Focus indicators visible
  - Active states respond
  - Disabled states clear
- [ ] **Error Handling**: Clear error messages in Swedish
- [ ] **Empty States**: Graceful handling when no data
- [ ] **Loading States**: Spinners/skeletons during data fetch
- [ ] **Mobile Polish**:
  - Touch targets ≥ 44x44px
  - Bottom navigation accessible
  - Safe area padding (notch handling)

### Testing Before Committing

#### Quick Pre-Commit Checks:

1. ✅ **TypeScript**: No type errors
   ```bash
   npx tsc --noEmit
   ```

2. ✅ **Linting**: No ESLint errors
   ```bash
   npm run lint
   ```

3. ✅ **Build**: Production build succeeds
   ```bash
   npm run build
   ```

4. ✅ **Visual Verification**: Playwright quick check (see above)

5. ✅ **Console Clean**: No JavaScript errors
   ```javascript
   mcp__playwright__browser_console_messages();
   ```

## Important Notes

### Breaking Changes Allowed

This project is in active development with minimal users:
- **Restaurants**: ~6
- **Users**: 1 (admin only)
- **Ratings**: ~4

**Therefore:**
- Breaking changes to schema are acceptable
- No data migration required (can re-add from scratch)
- URL structure can change freely
- Feel free to refactor aggressively

### Environment Variables

Required in `.env.local`:

```bash
# AWS DynamoDB
NEXT_PUBLIC_DYNAMODB_TABLE_NAME=
NEXT_PUBLIC_ACCESS_KEY_ID=
NEXT_PUBLIC_SECRET_ACCESS_KEY=
NEXT_PUBLIC_AWS_REGION=

# Admin
NEXT_PUBLIC_LAMBDA_PASSWORD=

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Google Site Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=

# Debug Flags (Optional - controls console logging)
NEXT_PUBLIC_DEBUG_PERFORMANCE=false  # Performance & SEO metrics (LCP, CLS, FID, resource loading)
NEXT_PUBLIC_DEBUG_ANALYTICS=false    # Analytics tracking, consent, Google Analytics events
NEXT_PUBLIC_DEBUG_AUTH=false         # Authentication, Amplify, user sessions, token refresh
```

**Debug Flag Usage:**
- Set to `true` to enable detailed console logging for debugging
- Set to `false` (or omit) for production to minimize console noise
- **Recommended:** Keep all debug flags `false` in production
- **Development:** Enable specific categories as needed for debugging

### Files to Never Modify

- `/infrastructure/**/*` - AWS CDK infrastructure code
- `/amplify/**/*` - Amplify configuration
- `/cdk.out/**/*` - CDK build output
- `amplify_outputs.json` - Amplify outputs
- `/public/static/logo.png` - **Use this logo** (user-specified)

### Current Implementation Status

**✅ Fully Implemented:**
- Homepage with map + list view
- Restaurant detail pages (slug-based routing)
- Dual rating system (General + Sås)
- Review system with text (CRUD + likes)
- City-specific pages (6 cities)
- Authentication (Cognito + Google SSO)
- Admin dashboard
- Suggestion submission
- Mobile-responsive map
- Tailwind CSS design system
- Plus Jakarta Sans typography
- Material Symbols icons
- Modern component library
- Separate login/register pages
- Header + Bottom Navigation

**🚧 In Progress:**
- Restaurant detail page layout (review integration)
- User profiles
- Account dashboard

**📋 Planned (Phase 4+):**
- User following system
- Enhanced admin analytics
- Advanced search/filters
- Photo uploads (future, not in scope)
- Email notifications (future, not in scope)

## Design Implementation Phases

The project is currently undergoing a complete redesign based on design mockups. Implementation follows these phases:

### Phase 0: Foundation ✅ COMPLETE
**Status**: All foundation work completed
- ✅ Tailwind configuration with design tokens
- ✅ Typography (Plus Jakarta Sans via Google Fonts)
- ✅ Icons (Material Symbols + Lucide legacy support)
- ✅ Type system updates (`app/types/index.ts`)
- ✅ Slug utilities (`app/lib/slugUtils.ts`)

### Phase 1: Component Library ✅ COMPLETE
**Status**: All core UI components modernized
- ✅ Button, Card, Input, Modal components updated
- ✅ Badge, Alert, LoadingSpinner components
- ✅ RatingInput (star/heart variants)
- ✅ DualRatingInput (General + Sås)
- ✅ ReviewCard with likes, edit badges
- ✅ ReviewForm with validation
- ✅ ReviewList with sorting
- ✅ RestaurantCard (3 variants)
- ✅ Header (desktop navigation with dropdowns)
- ✅ BottomNavigation (mobile 3-tab nav)

**Files Created/Updated**:
- `app/components/ui/RatingInput.tsx`
- `app/components/ui/DualRatingInput.tsx`
- `app/components/ui/ReviewCard.tsx`
- `app/components/ui/ReviewForm.tsx` ⭐ NEW
- `app/components/ui/ReviewList.tsx` ⭐ NEW
- `app/components/ui/RestaurantCard.tsx`
- `app/components/layout/Header.tsx`
- `app/components/layout/BottomNavigation.tsx`

### Phase 2: Core Pages ✅ COMPLETE
**Status**: All core pages implemented with modern design
- ✅ Homepage redesign (`app/page.tsx`)
  - MapViewToggle integration
  - Modern loading states
  - Analytics tracking
- ✅ Restaurant detail routing (`app/restaurang/[id]/PlacePageClient.tsx`)
  - Slug-based URLs working
  - Dynamic SEO metadata
  - Client-side navigation
- ✅ Separate auth pages
  - Login page (`app/login/page.tsx`)
  - Register page (`app/register/page.tsx`)
  - Email confirmation flow
  - Password validation
  - Modern form design

**Files Created/Updated**:
- `app/page.tsx` - Homepage with modern header
- `app/login/page.tsx` - Separate login page
- `app/register/page.tsx` - Separate register page
- `app/restaurang/[id]/PlacePageClient.tsx` - Detail page wrapper

### Phase 3: Review System ✅ 100% COMPLETE
**Status**: Review system fully implemented and integrated
- ✅ Dual rating implementation
  - RatingInput component (stars/hearts)
  - DualRatingInput component (General + Sås)
  - DualRatingStars submission handler
- ✅ Review writing/editing
  - ReviewForm component with validation ⭐ NEW
  - Textarea inputs for General + Sås reviews
  - Character limits (500/300)
  - Tips and helper text
- ✅ Review display
  - ReviewCard component (likes, edited badge)
  - ReviewList component (sorting, pagination) ⭐ NEW
  - Like/unlike functionality
  - Edit/delete for owners
- ✅ Review API endpoints
  - `POST /api/reviews` - Create review
  - `PUT /api/reviews` - Update review
  - `DELETE /api/reviews` - Delete review
  - `GET /api/reviews?restaurantId=X` - List reviews
  - `POST /api/reviews/[id]/like` - Toggle like
- ✅ Restaurant detail page layout
  - Comprehensive restaurant header with dual ratings
  - "Write Review" button with Modal integration
  - ReviewList component integrated
  - ReviewForm in Modal for writing/editing
  - Auto-refresh after review submission/update
  - Loading and empty states
  - Mobile and desktop responsive design

**Files Created/Updated**:
- `app/components/ui/ReviewForm.tsx` ⭐ NEW (220 lines)
- `app/components/ui/ReviewList.tsx` ⭐ NEW (270 lines)
- `app/api/reviews/route.ts` - CRUD endpoints (349 lines)
- `app/api/reviews/[id]/like/route.ts` - Like toggle (108 lines)
- `app/restaurang/[id]/PlacePageClient.tsx` - Complete detail page layout (282 lines) ⭐ UPDATED

### Phase 4: Account System 📋 PENDING
**Status**: Not started
- Account dashboard with tabs
- Profile management
- User following
- Review history

### Phase 5: Suggestions 📋 PENDING
**Status**: Basic implementation exists, needs redesign
- Enhanced submission flow
- Status tracking
- Admin approval interface

### Phase 6: Admin 📋 PENDING
**Status**: Basic admin exists, needs modernization
- Analytics dashboard
- Enhanced management tools
- Restaurant moderation

### Phase 7: Optimization 📋 PENDING
**Status**: Not started
- SEO improvements
- Performance tuning
- Mobile polish
- Accessibility audit

### Phase 8: Launch 📋 PENDING
**Status**: Not started
- Final testing
- Documentation
- Deployment

## Future Features (Not in Current Scope)

These features have been planned for future implementation. See `/docs/` for detailed implementation guides and Claude prompts:

- **Photo Uploads** (`/docs/photo-uploads.md`)
  - S3 + CloudFront integration
  - Image optimization
  - User-uploaded restaurant photos

- **Email Notifications** (`/docs/email-notifications.md`)
  - SES integration
  - Suggestion approval/rejection emails
  - Review notifications

- **Gamification** (`/docs/gamification.md`)
  - Såspoäng (sauce points) system
  - Leaderboards
  - Achievements

## Testing with Playwright

### Setup & Prerequisites

**IMPORTANT**: Always run `nvm use` before any development or testing work to ensure correct Node.js version.

```bash
# Always start with this
nvm use

# Install Playwright browsers (if not already installed)
npx playwright install chromium
```

### Using Playwright MCP for Visual Testing

Playwright MCP is installed for automated browser testing and visual verification. Use it throughout development to ensure UI quality.

#### Browser Management

**IMPORTANT - Tab Management**: To prevent accumulating open tabs during development:

```javascript
// At the end of each testing session, close the browser
mcp__playwright__browser_close();

// If you need a fresh start
mcp__playwright__browser_close();
// Then navigate to start new session
mcp__playwright__browser_navigate("http://localhost:3000");
```

**Cookie Consent**: The site may have cookie consent dialogs. Always accept cookies during testing:

```javascript
// After navigating to any page, check for and accept cookies
mcp__playwright__browser_click({
  element: "Accept cookies button",
  ref: "button:has-text('Acceptera')"
});
```

#### Testing on Desktop and Mobile

Always test responsive designs on both desktop and mobile viewports:

```javascript
// Desktop testing (standard)
mcp__playwright__browser_resize(1440, 900);
mcp__playwright__browser_navigate("http://localhost:3000");
mcp__playwright__browser_take_screenshot();

// Mobile testing (iPhone 14 Pro)
mcp__playwright__browser_resize(390, 844);
mcp__playwright__browser_navigate("http://localhost:3000");
mcp__playwright__browser_take_screenshot();

// Tablet testing (iPad)
mcp__playwright__browser_resize(768, 1024);
```

#### Essential Testing Commands

```javascript
// Navigation & Page Loading
mcp__playwright__browser_navigate(url)
mcp__playwright__browser_wait_for({ text: "Expected text" })

// Screenshots & Visual Verification
mcp__playwright__browser_take_screenshot()              // Full page
mcp__playwright__browser_resize(width, height)          // Change viewport

// Interaction Testing
mcp__playwright__browser_click({ element: "Button", ref: ".button-class" })
mcp__playwright__browser_type({ element: "Input", ref: "#email", text: "test@example.com" })
mcp__playwright__browser_hover({ element: "Menu", ref: ".menu-item" })

// Debugging & Validation
mcp__playwright__browser_console_messages()             // Check for JS errors
mcp__playwright__browser_snapshot()                     // Accessibility tree
```

#### Standard Testing Viewports

```javascript
// Mobile viewports
{ width: 375, height: 812 }   // iPhone standard
{ width: 390, height: 844 }   // iPhone 14 Pro
{ width: 360, height: 740 }   // Android standard

// Tablet viewports
{ width: 768, height: 1024 }  // iPad portrait
{ width: 1024, height: 768 }  // iPad landscape

// Desktop viewports
{ width: 1440, height: 900 }  // Standard desktop (design reference)
{ width: 1920, height: 1080 } // Full HD
```

#### Quick Visual Check Protocol

**REQUIRED after every front-end change:**

1. Ensure dev server is running (`npm run dev`)
2. Navigate to affected page
3. Test on mobile (390x844) and desktop (1440x900)
4. Check for console errors
5. Verify interactive elements work
6. Close browser when done

```javascript
// Example complete test flow
nvm use  // Always first!

// Start browser session
mcp__playwright__browser_navigate("http://localhost:3000");

// Accept cookies
mcp__playwright__browser_click({ element: "Accept cookies", ref: "button:has-text('Acceptera')" });

// Test mobile
mcp__playwright__browser_resize(390, 844);
mcp__playwright__browser_take_screenshot();

// Test desktop
mcp__playwright__browser_resize(1440, 900);
mcp__playwright__browser_take_screenshot();

// Check for errors
mcp__playwright__browser_console_messages();

// Clean up - close browser
mcp__playwright__browser_close();
```

### Using @playwright/test for E2E Testing

For comprehensive end-to-end testing, use the Playwright Test framework:

```bash
# Run tests with chromium
npx playwright test --project=chromium

# Run tests on both desktop and mobile
npx playwright test --project=chromium --project=mobile-chromium

# Run specific test file
npx playwright test tests/review-flow.spec.ts

# Run with UI mode (helpful for debugging)
npx playwright test --ui

# Generate test report
npx playwright show-report
```

Example test structure:

```typescript
// tests/review-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Review System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Accept cookies
    await page.click('button:has-text("Acceptera")');
  });

  test('should display review form when clicking Write Review', async ({ page }) => {
    // Navigate to restaurant detail
    await page.goto('http://localhost:3000/restaurang/test-restaurant-stockholm');

    // Click write review button
    await page.click('button:has-text("Skriv recension")');

    // Verify modal opens
    await expect(page.locator('h3:has-text("Skriv en recension")')).toBeVisible();
  });

  test('should submit review with dual ratings', async ({ page, isMobile }) => {
    // Test varies by viewport
    if (isMobile) {
      await page.setViewportSize({ width: 390, height: 844 });
    } else {
      await page.setViewportSize({ width: 1440, height: 900 });
    }

    // ... rest of test
  });
});
```

## Helpful Resources

- **Next.js 14 Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **AWS Amplify**: https://docs.amplify.aws/
- **Leaflet.js**: https://leafletjs.com/
- **Material Symbols**: https://fonts.google.com/icons
- **DynamoDB SDK**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- **Playwright MCP**: Installed and configured for browser automation
- **Playwright Test**: https://playwright.dev/

## Getting Help

When working with Claude Code on this project:

1. Always reference this CLAUDE.md first
2. Check type definitions in `/app/types/index.ts`
3. Review existing components before creating new ones
4. Follow the established patterns in `/app/api/`
5. Test responsively (mobile-first)
6. Keep Swedish language consistency

## Swedish Language Reference

Common phrases for UI:

```
Logga in = Log in
Logga ut = Log out
Registrera = Register
Skapa konto = Create account
Glömt lösenord = Forgot password
Kom ihåg mig = Remember me
Sök = Search
Filtrera = Filter
Sortera = Sort
Visa mer = Show more
Ladda fler = Load more
Spara = Save
Avbryt = Cancel
Radera = Delete
Redigera = Edit
Stäng = Close
Öppna = Open
Skicka = Send/Submit
Tillbaka = Back
Hem = Home
```

---

## Document Status

**Last Updated**: January 2025
**Current Phase**: Phase 3 (Review System) - ✅ COMPLETE
**Project Status**: Active development, Phases 0-3 complete
**Next Milestone**: Phase 4 (Account System)

### Phase Completion Summary
- ✅ Phase 0: Foundation - COMPLETE
- ✅ Phase 1: Component Library - COMPLETE
- ✅ Phase 2: Core Pages - COMPLETE
- ✅ Phase 3: Review System - COMPLETE
- 📋 Phase 4-8: Pending

**Note to AI**: This document should be updated whenever a phase milestone is reached. Update the phase statuses in the "Design Implementation Phases" section with detailed completion notes.

### Recent Fixes (January 2025)
- ✅ Fixed missing Header on city pages - Added Header + BottomNavigation to CityPageLayout component
- ✅ Fixed "Städer" submenu z-index issue - Increased dropdown z-index to `z-[9999]` to appear above map
- ✅ Fixed Map component errors - Removed old Header reference, cleaned up permissionState
- ✅ Fixed TypeScript errors - Updated User type references from `user?.attributes?.email` to `user?.username`
- ✅ Added design screenshot references - All design mockups documented in "Design Reference Screenshots" section

### Recent Completions (January 2025)
- ✅ **Phase 3 Complete** - Restaurant detail page fully redesigned with review system integration
  - Complete restaurant header layout with dual ratings, address, and metadata
  - "Write Review" button opens Modal with ReviewForm component
  - ReviewList component displays all reviews with sorting and filtering
  - Auto-refresh after review submission, edit, or delete
  - Responsive design for mobile and desktop
  - Proper loading and empty states 