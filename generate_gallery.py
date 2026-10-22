import json
import re
from pathlib import Path

base_dir = Path(__file__).resolve().parent
folder = base_dir / 'gallery-images'
output_file = base_dir / 'gallery-data.js'
allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}

images = []
if folder.exists():
    for item in sorted(folder.iterdir(), key=lambda x: x.name.lower()):
        if not item.is_file():
            continue
        if item.suffix.lower() not in allowed_extensions:
            continue
        if re.search(r'\s+copy\b', item.name, flags=re.IGNORECASE):
            continue

        title = item.stem.replace('-', ' ').replace('_', ' ')
        title = ' '.join(part.capitalize() for part in title.split())
        images.append({
            'src': f'gallery-images/{item.name}',
            'alt': title,
            'title': title,
        })

output = 'window.galleryImages = ' + json.dumps(images, ensure_ascii=False, indent=2) + ';\n'
output_file.write_text(output, encoding='utf-8')
print(f'Generated {len(images)} gallery image(s)')
