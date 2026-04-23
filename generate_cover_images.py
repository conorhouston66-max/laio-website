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
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=swap" rel="stylesheet">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ width: 1200px; height: 630px; background: #0A0908; overflow: hidden; }}
  .canvas {{
    width: 1200px; height: 630px; position: relative;
    display: flex; align-items: center; justify-content: center;
    padding: 80px;
  }}
  .title {{
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 80px; font-weight: 800;
    color: #FFFFFF; line-height: 1.05;
    letter-spacing: -0.035em;
    text-align: center;
    position: relative; z-index: 2;
  }}
</style>
</head>
<body>
<div class="canvas">
  <div class="title">{title}</div>
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
