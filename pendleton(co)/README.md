# Pendleton Companies Website

## Overview
A fully production-ready, multi-page website for Pendleton Companies built with:
- **7-1 CSS Architecture** (abstracts, vendors, base, layout, components, pages, themes)
- **Responsive Design** — desktop, laptop, tablet, mobile
- **Dark Mode / Light Mode** — auto-detects OS preference, user-toggleable
- **Internationalization (i18n)** — auto-detects browser language (EN, ES, FR, DE, ZH)
- **SEO Optimized** — semantic HTML5, meta tags, structured data (JSON-LD), canonical URLs
- **Accessibility** — ARIA labels, keyboard navigation, focus management, reduced motion support
- **Performance** — lazy image loading, intersection observers, CSS animations

---

## Project Structure

```
pendleton/
├── index.html                    # Home page
├── assets/
│   ├── icons/
│   │   └── logo.svg              # Company logo (replace with actual)
│   ├── images/                   # Add: hero-poster.jpg, team photos, property photos
│   └── videos/
│       └── hero.mp4              # ADD: Hero background video
├── css/
│   ├── main.css                  # Entry point — imports all partials
│   ├── abstracts/
│   │   ├── _variables.css        # Design tokens (colors, fonts, spacing)
│   │   └── _mixins.css           # Utility classes
│   ├── vendors/
│   │   └── _normalize.css        # CSS normalize
│   ├── base/
│   │   ├── _reset.css            # Base element styles
│   │   ├── _typography.css       # Font imports & typography classes
│   │   └── _animations.css       # Keyframes & reveal classes
│   ├── layout/
│   │   ├── _navbar.css           # Main navigation
│   │   ├── _subnav.css           # Sub-navigation bar
│   │   ├── _footer.css           # Footer
│   │   └── _grid.css             # Grid system
│   ├── components/
│   │   ├── _buttons.css          # Button variants
│   │   ├── _hero.css             # Hero section types
│   │   ├── _cards.css            # Card components
│   │   ├── _tabs.css             # Tab components
│   │   ├── _timeline.css         # Interactive timeline
│   │   ├── _modal.css            # Modal/dialog
│   │   ├── _filters.css          # Filter forms
│   │   ├── _map.css              # Map container
│   │   └── _forms.css            # Form elements
│   ├── pages/
│   │   ├── _home.css             # Home page styles
│   │   ├── _about.css            # About section styles
│   │   ├── _portfolio.css        # Portfolio styles
│   │   ├── _careers.css          # Careers styles
│   │   └── _portal.css           # Portal styles
│   └── themes/
│       ├── _light.css            # Light mode variables
│       └── _dark.css             # Dark mode variables
├── js/
│   ├── main.js                   # Core: navbar, theme, i18n, animations, tabs, modals
│   ├── about.js                  # About: timeline, advantage steps
│   ├── portfolio.js              # Portfolio: filters, charts, property rendering
│   └── careers.js                # Careers: position filtering & rendering
└── pages/
    ├── about/
    │   ├── mission.html          # Mission statement + values
    │   ├── story.html            # Interactive timeline
    │   ├── advantage.html        # Vertical integration process
    │   ├── companies.html        # 4 companies (tabbed)
    │   └── leadership.html       # Leadership team
    ├── portfolio/
    │   └── index.html            # Portfolio with filters, charts, map, property cards
    ├── careers/
    │   ├── index.html            # Careers landing (triple hero image)
    │   ├── benefits.html         # Nested tabs: insurance, retirement, time off
    │   ├── advancement.html      # Tenure & promotions
    │   └── positions.html        # Filterable open positions
    └── portal/
        └── index.html            # Portal login cards (investors, vendors, employees, applicants)
```

---

## Setup Instructions

### 1. Add Your Hero Video
Place your `.mp4` video file at:
```
assets/videos/hero.mp4
```
Add a poster image (shown before video loads):
```
assets/images/hero-poster.jpg
```

### 2. Replace the Logo
The logo is at `assets/icons/logo.svg`. Replace with your actual SVG logo.
The logo appears in:
- Navbar (left side, links to home)
- Footer

### 3. Connect Real Data

**Portfolio Properties** — Edit `js/portfolio.js`:
```js
const propertiesDB = [
  { id:1, name:'Property Name', location:'City, ST', state:'ST', type:'Multifamily', ... },
  // Add your actual properties here or connect to an API
];
```

**Open Positions** — Edit `js/careers.js`:
```js
const positionsDB = [
  { id:1, title:'Job Title', dept:'Department', location:'City, ST', ... },
  // Connect to your ATS/HRIS or update manually
];
```

### 4. Add Team Photos
Add leadership photos to `assets/images/` and update `pages/about/leadership.html`:
```html
<img src="../../assets/images/james-pendleton.jpg" alt="James Pendleton" class="leader-card__photo">
```

### 5. Add Property Photos
Add property images and reference them in `js/portfolio.js`:
```js
{ ..., img: '../../assets/images/properties/pendleton-flats.jpg' }
```

### 6. Add Interactive Map
In `pages/portfolio/index.html`, replace the placeholder with Leaflet or Google Maps:
```html
<div id="leaflet-map"></div>
```
Then in `js/portfolio.js`, initialize your map library.

### 7. Connect Portal Logins
Update the portal card links in `pages/portal/index.html` to point to your actual portal systems:
```html
<a href="https://your-investor-portal.com" class="portal-card">
```

### 8. Update Contact Information
Search and replace `info@pendletoncompanies.com` and `invest@pendletoncompanies.com` throughout the files.

---

## Customization

### Colors
Edit `css/abstracts/_variables.css`:
```css
--clr-primary: #1B2B3A;   /* Deep navy — main brand color */
--clr-accent:  #C9A84C;   /* Gold — accent color */
```

### Fonts
Fonts are loaded from Google Fonts in `css/base/_typography.css`.
- **Display**: Playfair Display (headings, hero titles)
- **Heading**: Cormorant Garamond (section headings)
- **Body**: Lato (body text)
- **UI**: Montserrat (labels, nav, buttons)

### Languages
Add more languages in `js/main.js` in the `translations` object:
```js
const translations = {
  en: { ... },
  pt: { nav_home: 'Início', ... },  // Add Portuguese, etc.
};
```

### Dark Mode
Dark mode variables are in `css/themes/_dark.css`. The theme auto-detects via `prefers-color-scheme` and can be manually toggled via the moon/sun button in the navbar.

---

## Deployment

This is a static website — deploy to any static host:
- **Netlify** — drag and drop the `pendleton/` folder
- **GitHub Pages** — push to a repo and enable Pages
- **AWS S3 + CloudFront** — upload files and configure CloudFront
- **Apache/Nginx** — serve the folder as document root
- **Vercel** — deploy from Git with zero configuration

For clean URLs (no `.html` extensions), configure your server to remove the extension:

**Netlify** (`_redirects` or `netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/:splat.html"
  status = 200
```

---

## SEO Notes
- All pages have `<meta name="description">` and `og:` meta tags
- `index.html` includes JSON-LD structured data (Organization schema)
- Semantic HTML5 used throughout (nav, main, section, article, footer, h1-h6)
- All images should have descriptive `alt` attributes
- Add a `sitemap.xml` and `robots.txt` for full SEO

---

## Browser Support
- Chrome, Edge, Firefox, Safari — last 2 major versions
- Mobile: iOS Safari, Android Chrome
- IE11 is not supported (uses CSS custom properties, Grid, IntersectionObserver)
