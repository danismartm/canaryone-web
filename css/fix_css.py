import os
import re

css_dir = "/Users/danismartm/Documents/CANARYONE/WEB/css"

def replace_hardcoded_colors():
    for filename in os.listdir(css_dir):
        if not filename.endswith('.css'):
            continue
            
        filepath = os.path.join(css_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Skip global.css initially to avoid replacing the root token declarations
        if filename == 'global.css':
            # We will handle btn-ghost separately for global.css
            content = re.sub(
                r'color:\s*var\(--cream\);\s*\n\s*font-weight:\s*500;\s*\n\s*font-size:\s*1rem;\s*\n\s*padding:\s*14px 28px;\s*\n\s*border-radius:\s*50px;\s*\n\s*border:\s*1\.5px\s*solid\s*rgba\(255,\s*255,\s*255,\s*\.22\);',
                r'color: var(--text);\n    font-weight: 500;\n    font-size: 1rem;\n    padding: 14px 28px;\n    border-radius: 50px;\n    border: 1.5px solid var(--card-border);',
                content
            )
            content = re.sub(
                r'\.btn-ghost:hover\s*\{\s*\n\s*background:\s*rgba\(255,\s*255,\s*255,\s*\.08\);\s*\n\s*border-color:\s*rgba\(255,\s*255,\s*255,\s*\.45\);\s*\n\s*\}',
                r'.btn-ghost:hover {\n    background: var(--card-bg);\n    border-color: var(--text-dim);\n}',
                content
            )
        else:
            # For other CSS files, replace background rgba(255, 255, 255, ...) with var(--card-bg)
            # and border/border-color/border-bottom rgba(255, 255, 255, ...) with var(--card-border)
            
            # Use regex to replace background: rgba(255, 255, 255, 0.xx)
            content = re.sub(r'background:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(?:0?\.\d+)\s*\);', r'background: var(--card-bg);', content)
            
            # Use regex to replace borders: border: ... rgba(255, ...)
            content = re.sub(r'(border[\w-]*):\s*([^;]+)rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(?:0?\.\d+)\s*\)([^;]*);', r'\1: \2var(--card-border)\3;', content)
            
        with open(filepath, 'w') as f:
            f.write(content)
            
if __name__ == "__main__":
    replace_hardcoded_colors()
    print("Done")
