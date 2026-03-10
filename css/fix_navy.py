import os
import re

css_dir = "/Users/danismartm/Documents/CANARYONE/WEB/css"

def replace_navy_colors():
    for filename in os.listdir(css_dir):
        if not filename.endswith('.css'):
            continue
            
        filepath = os.path.join(css_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Skip global.css initially to avoid replacing the root token declarations
        if filename != 'global.css':
            content = re.sub(r'rgba\(\s*10\s*,\s*22\s*,\s*40\s*,', r'rgba(var(--navy-rgb),', content)
            content = re.sub(r'rgba\(\s*18\s*,\s*32\s*,\s*64\s*,', r'rgba(var(--navy-mid-rgb),', content)
            
        with open(filepath, 'w') as f:
            f.write(content)
            
if __name__ == "__main__":
    replace_navy_colors()
    print("Done")
