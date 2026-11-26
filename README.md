# Claro Auto Body Website

Marketing site for Claro Auto Body, 10855 NE Simpson St, Suite 2, Portland, OR 97220.
It is a static site (plain HTML, CSS and JavaScript, no build step), ready for Netlify.

## Structure

```
index.html              Markup only (SEO head + JSON-LD, sections, gallery, SVG icon sprite)
404.html                Not-found page (Netlify serves it automatically)
css/
  base.css              Design tokens, reset, typography, buttons, utilities
  layout.css            Progress bar, header + nav, mobile menu, footer, floating call button
  components.css        Lead forms, FAQ accordion, lightbox
  sections.css          Hero, services, gallery, reviews, contact
  responsive.css        Breakpoints: 1279px (nav), 1080px (tablet), 720px (mobile)
js/
  modules/              One small module per feature, each exposes init()
    images.js           Photo fallbacks
    hero-video.js       Hero background video (mobile or desktop clip, poster first)
    header.js           Sticky header state, scroll progress, footer year
    menu.js             Mobile menu
    forms.js            Netlify estimate form submit over fetch
    faq.js              Accordion
    smooth-anchors.js   In-page links with header offset
    form-spotlight.js   Pops and rings the estimate form on "Get my free estimate" (no scroll if it is already on screen)
    before-after.js     Before/after drag sliders (range input, hint nudge on first view)
    reviews.js          Continuous reviews loop (pauses on hover)
    gallery.js          Lightbox for the gallery tiles (arrows, thumbnails, keyboard, swipe)
    animations.js       GSAP scroll reveals, always falls back to visible content
  main.js               Starts every module, isolated so one error can't break the page
images/before-after/     Self-hosted before/after photo pairs
videos/                  Compressed hero videos + poster frames (desktop 1080p, mobile 720x1280)
sitemap.xml, robots.txt
favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest
og-image.jpg            1200x630 share image for Facebook, WhatsApp, X, LinkedIn
```

Scripts are classic deferred scripts (no ES modules) so the site also works when `index.html` is opened directly from disk.
The SVG icon sprite stays inline in `index.html` for the same reason: browsers block external `<use>` references on `file://`.

## Page sections

Hero with estimate form, Services, Our work (before/after sliders + gallery), Reviews (continuous loop), FAQ, Contact with map. All photos are real photos from the shop's Google listing.

## Editing

- **Gallery photos:** the tiles are plain HTML inside `#galleryGrid` in `index.html`, so search engines can index them. Copy an `<li>` to add a photo, set `src`, `data-full`, `width`, `height` and a descriptive `alt`. The grid is 4 columns and fills with no gaps when you have 1 `big` tile plus 2, 6 or 10 `tall` tiles (currently 1 + 6).
- **Colors and fonts:** change the CSS variables at the top of `css/base.css`.
- **Business details:** phone, address and hours appear in `index.html` (header, contact, footer) and in the JSON-LD block in the `<head>`.

- **Before/after pairs:** add both photos to `images/before-after/` (`name-before.jpg`, `name-after.jpg`) and copy one `<figure class="ba-card">` in `index.html`. Use `ba-card--wide` for landscape photos and `ba-card--tall` for portrait ones.

## Before launch

1. Replace `claroautobody.com` with the real domain in `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml` and `robots.txt`.
2. Confirm the details that came from defaults, not from the shop: opening hours, the email address and the "reply within one business day" promise in the estimate form.
3. Download the gallery photos and host them in the project. Google photo URLs can change over time.

## Netlify forms

One form is included: `estimate` in the hero. Its required `email` field is what Netlify uses as the Reply-To address.

1. Deploy the folder to Netlify. Forms are detected at deploy time.
2. In Netlify: Configuration > Notifications > Form submission notifications > Add notification > Email notification, and enter the shop's inbox.
3. Send a test submission and check it appears under Forms and in the inbox.

## SEO checklist (already in place)

- Title and meta description with service + city, canonical URL, `max-image-preview:large`
- Open Graph + Twitter cards with a real 1200x630 `og-image.jpg`
- JSON-LD graph: `WebSite`, `WebPage`, `AutoBodyShop` (address, geo, phone, hours, services, languages, payment, Google Maps + Yelp links) and `FAQPage`
- No `aggregateRating` in the schema: add one only if it matches a rating customers can see on the page and verify
- One `<h1>`, ordered headings, descriptive `alt` text, `width`/`height` on every image (no layout shift)
- Gallery and reviews are static HTML, not injected by JavaScript
- Hero image preloaded, other images lazy, scripts deferred, map iframe lazy
- `<address>` markup and the same name, address and phone (NAP) everywhere
- `sitemap.xml`, `robots.txt`, favicon set, web manifest, `404.html`

After launch: verify the site in Google Search Console, submit `sitemap.xml`, and add the website link to the Google Business Profile so both point at each other.
