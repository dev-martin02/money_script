import pdfplumber
import sys
import os

from dotenv import load_dotenv

load_dotenv() 

file_path = sys.argv[1]

def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text



raw_bank_data = extract_text_from_pdf(file_path)

# select all info from *start*transaction detail
start_index = raw_bank_data.find("*start*transaction detail")
end_index = raw_bank_data.find("*end*transaction detail", start_index)

transaction_details = raw_bank_data[start_index + len("*start*transaction detail"):end_index].strip()


import re
from datetime import datetime

def parse_transaction_lines(text_block):
    lines = text_block.strip().split('\n')
    transactions = []

    for line in lines:
        # Skip balance lines
        if "Balance" in line or "TRANSACTION DETAIL" in line or "DATE DESCRIPTION AMOUNT" in line:
            continue

        # Try to match: MM/DD Description ... amount (positive or negative)
        match = re.match(r"(\d{2}/\d{2})\s+(.+?)\s+(-?\d{1,3}(?:,\d{3})*(?:\.\d{2}))", line)
        if match:
            date_str, desc, amount_str = match.groups()

            # Normalize
            amount = float(amount_str.replace(",", ""))
            transaction = {
                "date": f"2025-{date_str[0:2]}-{date_str[3:5]}",  # e.g. "03/14" -> "2025-03-14"
                "description": desc.strip(),
                "amount": amount
            }
            transactions.append(transaction)

    return transactions


parsed_transactions = parse_transaction_lines(transaction_details)

import openai
import json
from datetime import datetime

# Insert your OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_gpt_to_parse(text_block):
    prompt = f"""
        You are a smart financial assistant. Extract all the transactions from the bank text below into JSON format.

        Each transaction must include:
        - "date": in YYYY-MM-DD format
        - "description": full text after the date
        - "amount": as a float (negative = expense, positive = income)
        - "transaction_type": "income" or "expense"
        - "category": a guess based on description, like "Groceries", "Transfer", "Utilities", etc.

        Example format:
        [
        {{
            "date": "2025-03-01",
            "description": "Zelle Payment To Oscar",
            "amount": -25.00,
            "transaction_type": "expense",
            "category": "Transfer"
        }}
        ]

        Now parse the following:

        {text_block}
        """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",  # you can use gpt-3.5-turbo for cheaper
        messages=[
            {"role": "system", "content": "You are a helpful finance assistant that classifies transactions."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )

    # Get response as string and load JSON
    return json.loads(response['choices'][0]['message']['content'])
