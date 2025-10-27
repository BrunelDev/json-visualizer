
import json
import os

# Read the JSON file
with open('app/firstEntries.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find the highest existing pdfUrl number
max_number = 0
for item in data:
    if 'pdfUrl' in item:
        # Extract number from pdfUrl like "/pdf/devis-001(23).pdf"
        url = item['pdfUrl']
        if '(' in url and ')' in url:
            num_str = url.split('(')[1].split(')')[0]
            try:
                num = int(num_str)
                if num > max_number:
                    max_number = num
            except ValueError:
                pass

# Add pdfUrl to objects that don't have it
for item in data:
    if 'pdfUrl' not in item:
        max_number += 1
        item['pdfUrl'] = f"/pdf/devis-001({max_number}).pdf"

# Write the updated JSON back to the file
with open('app/firstEntries.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added pdfUrl to {sum(1 for item in data if 'pdfUrl' in item)} objects.")
print(f"The highest number used is {max_number}.")
