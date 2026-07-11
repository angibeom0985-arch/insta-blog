import os
from PIL import Image

src_path = r"C:\Users\akb08\Downloads\밤픽.jpg"
public_dir = r"C:\Users\akb08\Desktop\Website\insta-blog\public"
icons_dir = os.path.join(public_dir, "icons")

os.makedirs(icons_dir, exist_ok=True)

try:
    img = Image.open(src_path)
    
    # 1. favicon.ico
    img.save(os.path.join(icons_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Created favicon.ico")

    # 2. favicon-32x32.png
    img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, "favicon-32x32.png"), "PNG")
    print("Created favicon-32x32.png")

    # 3. icon-192.png
    img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, "icon-192.png"), "PNG")
    print("Created icon-192.png")

    # 4. icon-512.png
    img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, "icon-512.png"), "PNG")
    print("Created icon-512.png")

    # 5. apple-touch-icon.png
    img.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, "apple-touch-icon.png"), "PNG")
    print("Created apple-touch-icon.png")

    print("All favicons generated successfully!")
except Exception as e:
    print("Error during favicon generation:", e)
