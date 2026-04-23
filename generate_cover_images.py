from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "C:/Users/cnrhs/Desktop/laio-website/blog/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

posts = [
    {
        "slug": "why-cold-email-fails",
        "tag": "Cold Email",
        "title": "Why Most Cold Email\nCampaigns Fail Before\na Single Reply",
        "sub": "The real problem is not your copy."
    },
    {
        "slug": "outbound-system-that-scales",
        "tag": "Systems",
        "title": "How to Build a B2B\nOutbound System That\nActually Compounds",
        "sub": "Infrastructure over one-off campaigns."
    },
    {
        "slug": "icp-targeting-framework",
        "tag": "Strategy",
        "title": "The ICP Targeting\nFramework We Use for\nEvery Client",
        "sub": "Firmographics alone do not cut it."
    },
    {
        "slug": "outsource-cold-email",
        "tag": "Strategy",
        "title": "How to Outsource Cold\nEmail Without\nGetting Burned",
        "sub": "What a legitimate done-for-you engagement looks like."
    },
]

def build_html(tag, title, sub):
    lines = title.split("\n")
    title_html = "<br>".join(lines)
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 1200px; height: 630px; background: #0A0908; overflow: hidden; font-family: 'Instrument Sans', sans-serif; }}
  .canvas {{
    width: 1200px; height: 630px;
    position: relative;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 72px 80px;
  }}
  .grid {{
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }}
  .accent-top {{
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #C8970F 0%, rgba(200,151,15,0.2) 100%);
  }}
  .glow {{
    position: absolute; right: -60px; top: 50%;
    transform: translateY(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(200,151,15,0.07) 0%, transparent 65%);
    pointer-events: none;
  }}
  .logo {{
    position: absolute; top: 32px; left: 48px;
    display: flex; align-items: center; gap: 10px; z-index: 3;
  }}
  .logo-brand {{
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.1em; text-transform: uppercase;
  }}
  .content {{ position: relative; z-index: 2; }}
  .tag {{
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #C8970F; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }}
  .tag::before {{
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #C8970F;
  }}
  .title {{
    font-family: 'Bricolage Grotesque', serif;
    font-size: 62px; font-weight: 800;
    color: #FFFFFF; line-height: 1.06;
    letter-spacing: -0.03em;
    margin-bottom: 28px;
    max-width: 780px;
  }}
  .sub {{
    font-family: 'Instrument Sans', sans-serif;
    font-size: 18px; color: rgba(255,255,255,0.35);
    line-height: 1.5; max-width: 560px;
  }}
  .cta-pill {{
    position: absolute; bottom: 36px; right: 52px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    color: #0A0908; background: #C8970F;
    padding: 9px 22px; border-radius: 100px;
    letter-spacing: 0.04em; z-index: 3;
  }}
</style>
</head>
<body>
<div class="canvas">
  <div class="grid"></div>
  <div class="glow"></div>
  <div class="accent-top"></div>
  <div class="logo">
    <svg width="30" height="22" viewBox="0 0 44 32" fill="none">
      <path d="M2 9 L2 2 L9 2" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 2 L42 2 L42 9" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 23 L2 30 L9 30" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 30 L42 30 L42 23" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 8 L12 24 L20 24" stroke="#FFFFFF" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 24 L27 8 L32 24" stroke="#FFFFFF" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="23.4" y1="19" x2="30.6" y2="19" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
    <span class="logo-brand">leadacquisition.io</span>
  </div>
  <div class="content">
    <div class="tag">{tag}</div>
    <div class="title">{title_html}</div>
    <div class="sub">{sub}</div>
  </div>
  <div class="cta-pill">leadacquisition.io</div>
</div>
</body>
</html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    for post in posts:
        html = build_html(post["tag"], post["title"], post["sub"])
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.set_content(html, wait_until="networkidle")
        page.wait_for_timeout(2000)
        out = f"{OUTPUT_DIR}/{post['slug']}.png"
        page.screenshot(path=out, clip={"x": 0, "y": 0, "width": 1200, "height": 630})
        print(f"Saved: {out}")
    browser.close()

print("All cover images generated.")
