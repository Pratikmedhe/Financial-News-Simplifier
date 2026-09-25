async function loadNews() {
        const refreshButton = document.getElementById("refresh-button");
        refreshButton.textContent = "Refreshing...";
        refreshButton.disabled = true;
    console.log("Loading news...");

    const newsContainer = document.getElementById("news-container");
    const newsCount = document.getElementById("news-count");
    newsContainer.innerHTML = "<p>🔄 Loading latest financial news...</p>";

    try {
        const response = await fetch("http://127.0.0.1:8000/news");
        if (!response.ok) {
            throw new Error("Unable to fetch financial news.");
        }

        if (!response.ok) {
            throw new Error("Failed to fetch news");
        }

        const data = await response.json();

        newsContainer.innerHTML = "";
        newsCount.textContent = `${data.articles.length} articles found`;
                refreshButton.textContent = "Refresh News";
                refreshButton.disabled = false;

        data.articles.forEach(article => {
            const articleElement = document.createElement("div");

            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.description || "No description available."}</p>
                <p class="source">
                   📰 <strong>Source:</strong> ${article.source}
                </p>
                <p class="published-date">
                    📅 <strong>Published:</strong> ${article.publishedAt || "Date unavailable"}
                </p>
                <a class="article-link" href="${article.url}" target="_blank">
                    Read Original Article
                </a>
                <br><br>
                <button class="simplify-button">Simplify This News</button>
                <hr>
            `;

            const button = articleElement.querySelector("button");

            button.addEventListener("click", function () {
                simplifyNews(article.description || "No description available.", button);
            });

            newsContainer.appendChild(articleElement);
        });

    } catch (error) {
        newsContainer.innerHTML =
            "<p>Unable to load financial news. Please try again.</p>";
    }
}


async function simplifyNews(text, button) {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/simplify?article_text=" +
            encodeURIComponent(text),
            {
                method: "POST"
            }
        );

        const data = await response.json();

        button.insertAdjacentHTML(
            "afterend",
            `<div class="simplified-news">
                <strong>AI Simplification:</strong>
                <p>${data.simplified}</p>
            </div>`
        );

    } catch (error) {
        console.error("Error simplifying news:", error);
        button.insertAdjacentHTML(
            "afterend",
            "<p>Unable to simplify this article.</p>"
        );
    }
}


loadNews();