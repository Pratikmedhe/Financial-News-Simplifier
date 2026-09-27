# Financial News Simplifier

Financial News Simplifier is a web application that helps ordinary users understand financial news in simple language.

## Features

- Fetches real-time financial news using NewsAPI
- Filters news related to finance, banking, business, markets, and the economy
- Displays news articles with source and publication date
- Uses Groq AI to simplify financial news
- Explains difficult financial terms in simple language
- Provides short everyday examples when useful
- Stores retrieved news metadata in SQLite
- Provides a FastAPI backend
- Provides an interactive HTML, CSS, and JavaScript frontend
- Includes API health monitoring
- Deployed using FastAPI Cloud

## Technology Stack

- Python
- FastAPI
- Groq API
- NewsAPI
- SQLite
- HTML
- CSS
- JavaScript
- Uvicorn
- Git and GitHub
- FastAPI Cloud

## Project Structure

```text
Financial-News-Simplifier/
│
├── backend/
│   ├── main.py
│   ├── test_newsapi.py
│   └── test_groq.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
├── pyproject.toml
├── README.md
└── venv/

API Endpoints
Health Check

GET /health

Checks whether the backend is running.

Get Financial News

GET /news

Fetches and returns financial news articles.

Simplify News

POST /simplify

Uses Groq AI to simplify financial news into easy-to-understand language.

How It Works
1 The frontend requests financial news from the FastAPI backend.
2 The backend requests current articles from NewsAPI.
3 Financially relevant articles are filtered and stored in SQLite.
4 The frontend displays the articles.
5 When the user selects "Simplify This News", the article text is sent to the FastAPI backend.
6 The backend sends the text to Groq AI.
7 The simplified explanation is returned to the frontend.


Security

API keys are stored as environment variables and are not committed to GitHub.

Deployment

The FastAPI backend is deployed using FastAPI Cloud.

Project Status

The core application is working and deployed successfully.