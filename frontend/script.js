async function loadNews() {
        const refreshButton = document.getElementById("refresh-button");
        refreshButton.textContent = "Refreshing...";
        refreshButton.disabled = true;
    console.log("Loading news...");

    const newsContainer = document.getElementById("news-container");
    const newsCount = document.getElementById("news-count");
    newsContainer.innerHTML = "<p>🔄 Loading latest financial news...</p>";

    try {
        const response = await fetch("https://financial-news-simplifier.fastapicloud.dev/news");
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

function formatAIResponse(text) {
    let html = text;

    // Convert Markdown headings
    html = html.replace(/^### (.*)$/gm, "<h4>$1</h4>");
    html = html.replace(/^## (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^# (.*)$/gm, "<h2>$1</h2>");

    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert blockquotes
    html = html.replace(/^>\s?(.*)$/gm, '<blockquote>$1</blockquote>');

    // Convert horizontal lines
    html = html.replace(/^---$/gm, "<hr>");

    // Convert Markdown tables
    const lines = html.split("\n");
    let result = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith("|") && line.endsWith("|")) {

            // Skip table separator row
            if (/^\|[\s\-|:]+\|$/.test(line)) {
                continue;
            }

            let cells = line
                .split("|")
                .slice(1, -1)
                .map(cell => cell.trim());

            if (!inTable) {
                result.push("<table><thead><tr>");
                cells.forEach(cell => {
                    result.push(`<th>${cell}</th>`);
                });
                result.push("</tr></thead><tbody>");
                inTable = true;
            } else {
                result.push("<tr>");
                cells.forEach(cell => {
                    result.push(`<td>${cell}</td>`);
                });
                result.push("</tr>");
            }

        } else {
            if (inTable) {
                result.push("</tbody></table>");
                inTable = false;
            }

            result.push(line);
        }
    }

    if (inTable) {
        result.push("</tbody></table>");
    }

    html = result.join("\n");

    // Convert bullet points
    html = html.replace(/^\s*[-*]\s+(.*)$/gm, "<li>$1</li>");

   // Clean up excessive empty lines
    html = html.replace(/\n\s*\n+/g, "\n");

// Convert remaining line breaks
    html = html.replace(/\n/g, "<br>");
    return html;
}
async function simplifyNews(text, button) {
    try {
        const response = await fetch(
            "https://financial-news-simplifier.fastapicloud.dev/simplify?article_text=" +
            encodeURIComponent(text),
            {
                method: "POST"
            }
        );

        const data = await response.json();

        button.insertAdjacentHTML(
            "afterend",
    `       <div class="simplified-news">
                <strong>AI Simplification:</strong>
                <div class="ai-content">${formatAIResponse(data.simplified)}</div>
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