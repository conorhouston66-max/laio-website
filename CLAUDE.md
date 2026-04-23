# Lead Acquisition Website - Project Context

## What This Is
The official website for **Lead Acquisition** (leadacquisition.io), a B2B cold email agency run by Conor Houston. The site is built in plain HTML/CSS/JS, hosted on Netlify, deployed via GitHub at `conorhouston66-max/laio-website`.

**Live URL:** https://fanciful-pony-73b68b.netlify.app (Netlify) / leadacquisition.io (custom domain)

---

## Business Context
Lead Acquisition runs done-for-you outbound systems for B2B agencies and SaaS companies. The core service is cold email at scale: infrastructure, lead data, offer engineering, copywriting, and sales process integration. Founder is Conor Houston (conor@leadacquisition.io).

**ICP:** B2B agencies and SaaS companies, typically $1M-$20M ARR, who want predictable pipeline without hiring SDRs.

**Key differentiator:** Runs outbound as a live experiment - multiple campaigns in parallel, data deciding what scales.

---

## Brand Guidelines - ALWAYS FOLLOW

### Voice and Tone
- Direct, engineered, authoritative. Lab/science firm aesthetic, not a typical agency.
- Never hype. Never fluffy. Specific and data-driven.
- **NO EM DASHES anywhere.** Use hyphens (-) or rephrase. This applies to all copy, blog posts, emails, CTAs - everything.

### Colors
- Background: `#0A0908` (near-black) on dark pages
- Background: `#F7F3EC` (cream) on light pages (main site, blog)
- Accent: `#C8970F` (amber/gold)
- Text: `#0F0F0F` on light pages, `#FFFFFF` on dark pages
- Muted text: `#555555`

### Fonts
- Headlines: **Bricolage Grotesque** (700/800 weight)
- Body: **Instrument Sans** (400/500/600 weight)
- Mono: **JetBrains Mono** (for code/technical elements)

### Logo
The LA bracket logo - SVG with corner brackets and "LA" letterform. Always use the correct SVG paths. Black on light backgrounds, white or amber on dark backgrounds.

---

## Tech Stack
- Plain HTML/CSS/JS - no framework, no build step
- Deployed via GitHub push to `main` branch - Netlify auto-deploys
- Blog posts are individual HTML files in `/blog/`
- No CMS - all content is hand-coded HTML

---

## File Structure
```
laio-website/
  index.html              # Main homepage
  acquisition-system.html # Sales letter page
  blog/
    index.html            # Blog listing page
    queue.json            # Keyword queue for blog posts
    why-cold-email-fails.html
    outbound-system-that-scales.html
    icp-targeting-framework.html
    outsource-cold-email.html
    images/               # Blog cover images (1200x630 OG images)
  logos/                  # Client logo assets
```

---

## Blog System

### Keyword Queue
The blog uses `/blog/queue.json` to track what to write next. Format:
```json
{
  "published": ["keyword-1", "keyword-2"],
  "queue": [
    {
      "keyword": "target keyword",
      "secondary": ["related keyword 1", "related keyword 2"],
      "tag": "Strategy|Cold Email|Systems|Deliverability",
      "intent": "Description of searcher intent"
    }
  ]
}
```
Always take the **first item in queue**, write the post, move the keyword to `published`, and remove it from the queue.

### Blog Post Requirements - ALWAYS DO ALL OF THESE

**Content:**
- Minimum 2000 words
- Primary keyword in H1 title
- Primary keyword appears naturally in first 100 words
- Secondary keywords woven into H2/H3 headings and body
- FAQ section at the end (minimum 4 questions) - critical for featured snippets
- Include at least 1 callout box with a key insight
- Internal links: link to at least 2 other blog posts where relevant
- No em dashes - hyphens only

**SEO - Every post MUST include:**
1. `<title>` tag with primary keyword near the front, under 60 chars where possible
2. `<meta name="description">` - 150-160 chars, includes primary keyword
3. `<link rel="canonical" href="https://leadacquisition.io/blog/[slug].html">`
4. Open Graph tags:
   - `og:title`, `og:description`, `og:image` (1200x630 cover image), `og:url`, `og:type`
5. Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
6. Article JSON-LD schema (see template below)

**Cover Image:**
- Every post needs a 1200x630px cover image saved to `/blog/images/[slug].png`
- Generated via Playwright screenshot of an HTML template (see `generate_cover_images.py`)
- Style is FIXED - do not change it: pure `#0A0908` black background, white Bricolage Grotesque 800 title, centered, nothing else
- Use a short punchy version of the title (4-6 words max) - not the full SEO title
- Template:
```python
html = f"""<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=swap" rel="stylesheet">
<style>
  * {{ margin:0;padding:0;box-sizing:border-box; }}
  body {{ width:1200px;height:630px;background:#0A0908;overflow:hidden; }}
  .canvas {{ width:1200px;height:630px;display:flex;align-items:center;justify-content:center;padding:80px; }}
  .title {{ font-family:'Bricolage Grotesque',sans-serif;font-size:80px;font-weight:800;color:#FFFFFF;line-height:1.05;letter-spacing:-0.035em;text-align:center; }}
</style></head><body><div class="canvas"><div class="title">{short_title}</div></div></body></html>"""
```
- Screenshot with Playwright at exactly 1200x630, save to `/blog/images/[slug].png`
- Referenced in `og:image` and `twitter:image`

**Nav:** Use the updated nav structure (right-aligned, links: How it works / Why us / Blog):
```html
<div class="nav-right">
  <ul class="nav-links">
    <li><a href="../index.html#how-it-works">How it works</a></li>
    <li><a href="../index.html#why-us">Why us</a></li>
    <li><a href="index.html" class="active">Blog</a></li>
  </ul>
  <a href="https://cal.com/conor-leadacquisition" class="nav-cta">Book a call [wave hand SVG]</a>
</div>
```

### JSON-LD Schema Template
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Post Title]",
  "description": "[Meta description]",
  "author": {
    "@type": "Person",
    "name": "Conor Houston",
    "url": "https://leadacquisition.io"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Lead Acquisition",
    "url": "https://leadacquisition.io",
    "logo": {
      "@type": "ImageObject",
      "url": "https://leadacquisition.io/logos/la-logo.svg"
    }
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "image": "https://leadacquisition.io/blog/images/[slug].png",
  "url": "https://leadacquisition.io/blog/[slug].html",
  "keywords": ["keyword1", "keyword2"]
}
</script>
```

---

## Scheduled Tasks
- **daily-blog-post**: Runs at 8am daily. Picks next keyword from queue.json, writes full SEO-optimized post, generates cover image, commits and pushes to GitHub. Next keyword is always the first item in the `queue` array.
- **emailbison-daily-report**: Runs at 9am daily. Campaign performance report.

---

## Key External Links
- Calendly booking: `https://cal.com/conor-leadacquisition`
- Sales letter (Google Doc): `https://docs.google.com/document/d/1fdTb1vGz_w0lvzhc4QKChlXYTQK1JFGEJ2DVDCp-Kxo/edit?usp=sharing`
- Newsletter: `https://leadacquisition.beehiiv.com/subscribe`

---

## Things That Have Been Done (Don't Redo)
- Case study cards use blurred favicon logos - no real company names or identities
- Navbar: "How it works / Why us / Blog" only - no Services, Case studies, FAQ links
- Hero CTA: "See case studies" links to Google Doc sales letter
- All logos on homepage use Google favicon service (`https://www.google.com/s2/favicons?domain=X&sz=128`)
- "Book a call" CTA everywhere includes animated waving hand SVG icon

---

## What the Site Needs (Ongoing Goals)
1. **Blog growth**: Publish 1 post per day from the keyword queue. Each post is 2000+ words, fully SEO-optimized, with cover image.
2. **Pipeline**: Every page drives to `https://cal.com/conor-leadacquisition`. Book a call is the primary CTA everywhere.
3. **Authority**: Build topical authority around cold email, outbound sales, B2B lead generation. The blog is the main SEO vehicle.
4. **Trust**: Case studies and social proof. The acquisition-system.html sales letter is the deep-dive proof asset.
