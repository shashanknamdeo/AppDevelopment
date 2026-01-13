
import os
from dotenv import load_dotenv

# get path from environment variable (Windows)
secrets_path = os.getenv("SECRETS_FILE")
if not secrets_path:
    raise SystemExit("SECRETS_FILE environment variable is not set.")

# load the file into the process environment
load_dotenv(dotenv_path=secrets_path, override=False)

# now access secrets via os.getenv
api_key = os.getenv("GOSSIPY_API_KEY")
# print('api_key : ', api_key)

# --------------------------------------------------------------------------

from google import genai

# 1. Create client with API key
client = genai.Client(api_key=api_key)

# 2. Use supported model
model = "models/gemini-2.5-flash"

# 3. Simple prompt
prompt = """
hi
"""

response = client.models.generate_content(
    model=model,
    contents=prompt
)

# 5. Print output
print(response.text)


prompt = """
You are an AI study planner.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON
- Do NOT include greetings
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include extra text

JSON SCHEMA (STRICT):

{
  "plan_version": "v1",
  "subject": "string",
  "total_days": number,
  "daily_time_minutes": number,
  "schedule": [
    {
      "start_day": number,
      "end_day": number,
      "topic_id": "string",
      "topic_name": "string",
      "difficulty": number (1-5)
    }
  ]
}

RULES:
- Days must cover exactly total_days
- Topics must be ordered from basic to advanced
- Beginner-friendly pacing
- Slow learning speed

INPUT:
Subject: AI
Total Days: 90
Daily Study Time: 360 minutes
    

"""


# for m in client.models.list():
#     print(m.name)

# 4. Generate content
response = client.models.generate_content(
    model=model,
    contents=prompt
)

# 5. Print output
print(response.text)
