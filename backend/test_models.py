import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("Your available Gemini Flash models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods and 'flash' in m.name.lower():
        print(m.name)