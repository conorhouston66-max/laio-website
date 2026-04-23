from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "C:/Users/cnrhs/Desktop/laio-website/blog/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

posts = [
    {
        "slug": "why-cold-email-fails",
        "tag": "Cold Email",
        "title": "Why Cold Email Fails",
    },
    {
        "slug": "outbound-system-that-scales",
        "tag": "Systems",
        "title": "Build Outbound That Compounds",
    },
    {
        "slug": "icp-targeting-framework",
        "tag": "Strategy",
        "title": "The ICP Targeting Framework",
    },
    {
        "slug": "outsource-cold-email",
        "tag": "Strategy",
        "title": "How to Outsource Cold Email",
    },
]

def build_html(tag, title, sub):
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Instrument+Sans:wght@500;600&display=swap" rel="stylesheet">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 1200px; height: 630px; background: #0A0908; overflow: hidden; }}
  .canvas {{
    width: 1200px; height: 630px; position: relative;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: flex-end;
    padding: 64px 72px;
  }}
  .grid {{
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }}
  .accent-top {{
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #C8970F 30%, transparent 100%);
  }}
  .glow {{
    position: absolute; bottom: -100px; left: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(200,151,15,0.09) 0%, transparent 65%);
  }}
  .logo {{
    position: absolute; top: 36px; left: 52px;
    display: flex; align-items: center; gap: 10px;
  }}
  .logo-mark {{ opacity: 0.5; }}
  .content {{ position: relative; z-index: 2; }}
  .tag {{
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #C8970F; margin-bottom: 22px;
  }}
  .title {{
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 72px; font-weight: 800;
    color: #FFFFFF; line-height: 1.02;
    letter-spacing: -0.035em;
    max-width: 860px;
  }}
  .domain {{
    position: absolute; bottom: 36px; right: 52px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.06em;
  }}
</style>
</head>
<body>
<div class="canvas">
  <div class="grid"></div>
  <div class="glow"></div>
  <div class="accent-top"></div>
  <div class="logo">
    <svg class="logo-mark" width="32" height="23" viewBox="0 0 44 32" fill="none">
      <path d="M2 9 L2 2 L9 2" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 2 L42 2 L42 9" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 23 L2 30 L9 30" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 30 L42 30 L42 23" stroke="#C8970F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 8 L12 24 L20 24" stroke="#FFFFFF" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 24 L27 8 L32 24" stroke="#FFFFFF" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="23.4" y1="19" x2="30.6" y2="19" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>
  <div class="content">
    <div class="tag">{tag}</div>
    <div class="title">{title}</div>
  </div>
  <div class="domain">leadacquisition.io</div>
</div>
</body>
</html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    for post in posts:
        html = build_html(post["tag"], post["title"], "")
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.set_content(html, wait_until="networkidle")
        page.wait_for_timeout(2000)
        out = f"{OUTPUT_DIR}/{post['slug']}.png"
        page.screenshot(path=out, clip={"x": 0, "y": 0, "width": 1200, "height": 630})
        print(f"Saved: {out}")
    browser.close()

print("All cover images generated.")
