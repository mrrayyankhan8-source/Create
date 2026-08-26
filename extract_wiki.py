import requests
import json
from bs4 import BeautifulSoup
import concurrent.futures

API_URL = "https://create.fandom.com/api.php"

def get_all_pages():
    pages = []
    apfrom = None

    while True:
        params = {
            "action": "query",
            "list": "allpages",
            "aplimit": "500",
            "format": "json"
        }
        if apfrom:
            params["apfrom"] = apfrom

        res = requests.get(API_URL, params=params).json()
        for p in res["query"]["allpages"]:
            pages.append(p)

        if "continue" in res:
            apfrom = res["continue"]["apcontinue"]
        else:
            break

    return [p for p in pages if p["ns"] == 0]

def get_page_data(page):
    params = {
        "action": "parse",
        "pageid": page["pageid"],
        "format": "json"
    }
    content = ""
    try:
        res = requests.get(API_URL, params=params).json()
        if "parse" in res and "text" in res["parse"] and "*" in res["parse"]["text"]:
            html = res["parse"]["text"]["*"]
            soup = BeautifulSoup(html, "html.parser")
            content = soup.get_text(separator='\n', strip=True)
    except Exception as e:
        print(f"Error fetching page {page['pageid']}: {e}")

    return {
        "title": page["title"],
        "url": f"https://create.fandom.com/wiki/{page['title'].replace(' ', '_')}",
        "content": content
    }

def main():
    print("Fetching all pages...")
    pages = get_all_pages()
    print(f"Total pages found: {len(pages)}")

    wiki_data = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(get_page_data, pages))
        wiki_data.extend(results)

    print("Saving to create_mod_wiki_data.json...")
    with open("create_mod_wiki_data.json", "w", encoding="utf-8") as f:
        json.dump(wiki_data, f, indent=4, ensure_ascii=False)
    print("Done!")

if __name__ == "__main__":
    main()
