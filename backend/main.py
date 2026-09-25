import os
import requests
import sqlite3

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

load_dotenv()

app = FastAPI(title="Financial News Simplifier")
DB_NAME = "news.db"
def init_db():
    conn = sqlite3.connect(DB_NAME)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            url TEXT UNIQUE,
            source TEXT
        )
    """)

    conn.commit()
    conn.close()


init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = Groq(api_key=GROQ_API_KEY)


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
@app.get("/")
def home():
    return {
        "message": "Financial News Simplifier is working!"
    }


@app.get("/news")
def get_news():
    url = "https://newsapi.org/v2/everything"

    params = {
        "q": "(finance OR banking OR economy OR investment OR stock market OR business OR inflation OR interest rates)",
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 10,
        "apiKey": NEWS_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return {
            "error": "Unable to fetch news",
            "details": response.json()
        }

    data = response.json()

    articles = []
    conn = sqlite3.connect(DB_NAME)

    financial_keywords = [
       "finance", "bank", "banking", "economy", "economic",
        "market", "stock", "investment", "investor", "inflation",
        "interest rate", "gold", "rupee", "business", "financial",
        "insurance", "loan", "nifty", "sensex", "revenue", "profit"
    ]

    for article in data.get("articles", []):
        text = (article.get("title") or "") + " " + (article.get("description") or "")

       

        if not any(keyword in text.lower() for keyword in financial_keywords):
            continue

        conn.execute(
            """
            INSERT OR IGNORE INTO news (title, description, url, source)
            VALUES (?, ?, ?, ?)
            """,
            (
                article.get("title"),
                article.get("description"),
                article.get("url"),
                article.get("source", {}).get("name")
            )
        )

        articles.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "url": article.get("url"),
            "source": article.get("source", {}).get("name"),
            "publishedAt": article.get("publishedAt")
        })

    conn.commit()
    conn.close()

    return {
        "articles": articles
    }

@app.post("/simplify")
def simplify_article(article_text: str):
    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You simplify financial news for ordinary people. Use simple English, explain difficult financial terms, and give a short everyday example when useful."
            },
            {
                "role": "user",
                "content": f"Simplify this financial news:\n\n{article_text}"
            }
        ],
        temperature=0.3
    )

    simplified_text = response.choices[0].message.content

    return {
        "simplified": simplified_text
    }