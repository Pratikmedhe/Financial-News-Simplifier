import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

response = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[
        {
            "role": "user",
            "content": "Explain what a fixed deposit is to a person who knows nothing about finance. Use very simple words and one everyday example."
        }
    ]
)

print("\nAI RESPONSE:\n")
print(response.choices[0].message.content)