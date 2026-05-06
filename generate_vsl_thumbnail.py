from playwright.sync_api import sync_playwright
import os

OUTPUT = "C:/Users/cnrhs/Desktop/laio-website/blog/images/vsl-thumbnail.png"

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1280px; height: 720px; background: #FFFFFF; overflow: hidden; font-family: 'Instrument Sans', sans-serif; }

  .canvas {
    width: 1280px; height: 720px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 80px;
    position: relative;
  }

  /* subtle grid */
  .canvas::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .label {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #C8970F; margin-bottom: 20px;
    position: relative; z-index: 2;
  }

  .title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 62px; font-weight: 800;
    color: #0A0908; line-height: 1.05;
    letter-spacing: -0.03em;
    text-align: center;
    margin-bottom: 56px;
    position: relative; z-index: 2;
  }

  .flow {
    display: flex; align-items: center; gap: 0;
    position: relative; z-index: 2;
    width: 100%;
    justify-content: center;
  }

  .step {
    display: flex; flex-direction: column;
    align-items: center;
    width: 180px;
  }

  .step-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 11px; font-weight: 700;
    color: #C8970F; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 10px;
  }

  .step-box {
    background: rgba(0,0,0,0.03);
    border: 1.5px solid rgba(0,0,0,0.12);
    border-radius: 14px;
    padding: 18px 16px;
    text-align: center;
    width: 100%;
    transition: border-color 0.2s;
  }

  .step-box.highlight {
    border-color: #C8970F;
    background: rgba(200,151,15,0.08);
  }

  .step-icon {
    font-size: 24px; margin-bottom: 10px; display: block;
  }

  .step-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 16px; font-weight: 700;
    color: #0A0908; line-height: 1.2;
    margin-bottom: 6px;
  }

  .step-desc {
    font-size: 12px; color: rgba(0,0,0,0.45);
    line-height: 1.4;
  }

  .arrow {
    color: rgba(0,0,0,0.2);
    font-size: 20px;
    padding: 0 6px;
    margin-bottom: 0;
    flex-shrink: 0;
    position: relative;
    top: 10px;
  }

  .arrow.gold { color: #C8970F; }

  .footer {
    position: absolute; bottom: 32px;
    display: flex; align-items: center; justify-content: space-between;
    width: calc(100% - 160px);
    z-index: 2;
  }

  .brand {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 13px; font-weight: 700;
    color: rgba(0,0,0,0.3);
    letter-spacing: 0.05em;
  }

  .play-hint {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: rgba(0,0,0,0.3);
    font-weight: 500;
  }

  .play-circle {
    width: 28px; height: 28px;
    border: 1.5px solid rgba(0,0,0,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  .play-tri {
    width: 0; height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid rgba(0,0,0,0.35);
    margin-left: 2px;
  }
</style>
</head>
<body>
<div class="canvas">
  <div class="label">Lead Acquisition — The System</div>
  <div class="title">How We Generate Pipeline<br>on Autopilot</div>

  <div class="flow">
    <div class="step">
      <div class="step-num">01</div>
      <div class="step-box">
        <span class="step-icon">⚙️</span>
        <div class="step-name">Infrastructure</div>
        <div class="step-desc">Domains, inboxes, warmup</div>
      </div>
    </div>

    <div class="arrow">→</div>

    <div class="step">
      <div class="step-num">02</div>
      <div class="step-box">
        <span class="step-icon">🎯</span>
        <div class="step-name">Lead Data</div>
        <div class="step-desc">Untouched lists, verified</div>
      </div>
    </div>

    <div class="arrow">→</div>

    <div class="step">
      <div class="step-num">03</div>
      <div class="step-box highlight">
        <span class="step-icon">✍️</span>
        <div class="step-name">Offer Engineering</div>
        <div class="step-desc">Built for cold traffic</div>
      </div>
    </div>

    <div class="arrow gold">→</div>

    <div class="step">
      <div class="step-num">04</div>
      <div class="step-box highlight">
        <span class="step-icon">🧪</span>
        <div class="step-name">Live Testing</div>
        <div class="step-desc">Multi-angle campaigns</div>
      </div>
    </div>

    <div class="arrow gold">→</div>

    <div class="step">
      <div class="step-num">05</div>
      <div class="step-box">
        <span class="step-icon">📅</span>
        <div class="step-name">Meetings Booked</div>
        <div class="step-desc">Qualified, on your calendar</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="brand">leadacquisition.io</div>
    <div class="play-hint">
      <div class="play-circle"><div class="play-tri"></div></div>
      Watch the 4-minute walkthrough
    </div>
  </div>
</div>
</body>
</html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    page.set_content(html, wait_until="networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path=OUTPUT, clip={"x": 0, "y": 0, "width": 1280, "height": 720})
    browser.close()
    print(f"Saved: {OUTPUT}")
