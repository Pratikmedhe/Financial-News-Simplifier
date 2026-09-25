import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("NEWS_API_KEY")

url = "https://newsapi.org/v2/everything"

params = {
    "q": "finance",
    "language": "en",
    "sortBy": "publishedAt",
    "pageSize": 5,
    "apiKey": api_key
}

response = requests.get(url, params=params)

print("Status Code:", response.status_code)

data = response.json()

if response.status_code == 200:
    print("NewsAPI is working!")
    
    for article in data["articles"]:
        print("-", article["title"])
else:
    print("Something went wrong:")
    print(data)