import asyncio
from playwright.async_api import async_playwright
import os

async def capture():
    html_path = os.path.abspath("linkedin-banner.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1584, "height": 396})
        await page.goto(file_url, wait_until="networkidle")

        # Wait for fonts to load
        await page.wait_for_timeout(2000)

        await page.screenshot(
            path="C:/Users/cnrhs/Desktop/linkedin-banner.png",
            clip={"x": 0, "y": 0, "width": 1584, "height": 396}
        )
        await browser.close()
        print("Done! Saved to C:/Users/cnrhs/Desktop/linkedin-banner.png")

asyncio.run(capture())
