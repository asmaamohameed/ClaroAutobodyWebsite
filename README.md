# Claro Auto Body Website

Marketing site for Claro Auto Body, 10855 NE Simpson St, Suite 2, Portland, OR 97220.
It is a static site (plain HTML, CSS and JavaScript, no build step), ready for Netlify.

## Structure

```
index.html              Markup only (SEO head, sections, SVG icon sprite)
css/
  base.css              Design tokens, reset, typography, buttons, utilities
  layout.css            Progress bar, header + nav, mobile menu, footer, floating call button
  components.css        Lead forms, FAQ accordion, lightbox
  sections.css          Hero, marquee, steps, services, why us, area, gallery, reviews, CTA, contact
  responsive.css        Breakpoints: 1279px (nav), 1080px (tablet), 720px (mobile)
js/
  data/gallery.js       Gallery photo list (edit this to add or swap photos)
  modules/              One small module per feature, each exposes init()
    images.js           Photo fallbacks
    header.js           Sticky header state, scroll progress, footer year
    menu.js             Mobile menu
    forms.js            Netlify form submit over fetch
    faq.js              Accordion
    smooth-anchors.js   In-page links with header offset
    gallery.js          Bento gallery + lightbox (arrows, thumbnails, keyboard, swipe)
    animations.js       GSAP scroll reveals, always falls back to visible content
  main.js               Starts every module, isolated so one error can't break the page
sitemap.xml, robots.txt
```

Scripts are classic deferred scripts (no ES modules) so the site also works when `index.html` is opened directly from disk.
The SVG icon sprite stays inline in `index.html` for the same reason: browsers block external `<use>` references on `file://`.

## Editing

- **Gallery photos:** edit `js/data/gallery.js`. Use `id` for a Google Maps photo key or `src` for a local file (for example `images/gallery/bumper.jpg`). Keep the `big, tall, tall / tall, big, tall` size rhythm so the grid has no gaps.
- **Colors and fonts:** change the CSS variables at the top of `css/base.css`.
- **Business details:** phone, address and hours appear in `index.html` (header, contact, footer) and in the JSON-LD block in the `<head>`.

## Before launch

1. Replace `claroautobody.com` with the real domain in `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml` and `robots.txt`.
2. Confirm or replace everything tagged `demo` on the page: hours, email, service-area towns, stock photos in the services cards.
3. Download the gallery photos and host them in the project. Google photo URLs can change over time.

## Netlify forms

Two forms are included: `estimate` (hero) and `contact`. Each has a required `email` field, which Netlify uses as the Reply-To address.

1. Deploy the folder to Netlify. Forms are detected at deploy time.
2. In Netlify: Configuration > Notifications > Form submission notifications > Add notification > Email notification, and enter the shop's inbox.
3. Send a test submission and check it appears under Forms and in the inbox.
