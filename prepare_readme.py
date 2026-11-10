#!/usr/bin/env python3
import sys

# Read the README.md file using native Python with explicit encoding
with open("README.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in README.md: {len(lines)}")

# Print first few lines to verify content
for i, line in enumerate(lines[:10]):
    print(f"Line {i}: |{repr(line)}|")

# Extract lines 0-72 (the header portion we want to keep)
header_lines = lines[:73]

# Write the cleaned content to a temporary file
clean_content = "".join(header_lines)
with open("README_body.txt", "w", encoding="utf-8") as f:
    f.write(clean_content)

print(f"Successfully extracted {len(header_lines)} lines to README_body.txt")
sys.exit(0)