import json
import mimetypes
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
GALLERY_DIR = BASE_DIR / 'gallery-images'
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}


def list_gallery_images():
    if not GALLERY_DIR.exists():
        return []

    files = []
    for item in sorted(GALLERY_DIR.iterdir(), key=lambda x: x.name.lower()):
        if not item.is_file():
            continue

        if item.suffix.lower() not in ALLOWED_EXTENSIONS:
            continue

        if re.search(r'\s+copy\b', item.name, flags=re.IGNORECASE):
            continue

        title = item.stem.replace('-', ' ').replace('_', ' ')
        title = ' '.join(part.capitalize() for part in title.split())
        files.append({
            'src': f'gallery-images/{item.name}',
            'alt': title,
            'title': title,
        })

    return files


class GalleryHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/gallery':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(json.dumps(list_gallery_images()).encode('utf-8'))
            return

        path = self.translate_path(self.path)
        if path.startswith(str(BASE_DIR)):
            super().do_GET()
            return

        self.send_error(404)

    def log_message(self, format, *args):
        return


if __name__ == '__main__':
    port = 8000
    server = ThreadingHTTPServer(('0.0.0.0', port), GalleryHandler)
    print(f'Serving gallery on http://localhost:{port}')
    server.serve_forever()
