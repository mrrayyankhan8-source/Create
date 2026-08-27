import requests
from bs4 import BeautifulSoup
import json

API_URL = "https://create.fandom.com/api.php"

def get_page_html(title):
    params = {
        "action": "parse",
        "page": title,
        "format": "json"
    }
    res = requests.get(API_URL, params=params).json()
    if "parse" in res and "text" in res["parse"] and "*" in res["parse"]["text"]:
        return res["parse"]["text"]["*"]
    return ""

html = get_page_html("Gearbox")
soup = BeautifulSoup(html, "html.parser")

headings = soup.find_all(['h1', 'h2', 'h3'])
print("Headings in Gearbox:")
for h in headings:
    print(f"- {h.name}: {h.get_text(strip=True)}")
