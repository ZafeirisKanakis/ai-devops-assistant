import os
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_content(text: str):
    prompt = f"""
    You are an expert DevOps engineer.

    Analyze the following configuration file and respond ONLY with a valid JSON object.

    The JSON must strictly follow this format:
    {{
    "summary": "A concise summary of what this configuration does",
    "issues": ["List of configuration mistakes, security risks, or bad practices"],
    "recommendations": ["List of concrete, practical improvements"]
    }}

    If you are not sure about something, omit it. 
    Do not include markdown, code fences, or any text outside the JSON.

    Configuration file:
    {text}
    """


    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful AI DevOps assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )

    # Προσπάθεια να πάρουμε καθαρό JSON από το AI
    # Προσπάθεια να κάνουμε safe parsing του JSON
    import json
    content = response.choices[0].message.content.strip()

    # Αν το AI τύχει να βάλει markdown ```json ... ```
    if content.startswith("```"):
        content = content.strip("`")
        content = content.replace("json", "", 1).strip()

    try:
        data = json.loads(content)
        return data
    except Exception:
        return {"summary": "Invalid JSON output", "raw": content}
