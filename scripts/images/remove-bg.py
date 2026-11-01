"""Local background removal for Rifkus packshots (never uploads anything).
Usage: venv/bin/python remove-bg.py <raw_dir> [model]
Reads <raw_dir>/source/*, writes <raw_dir>/cutouts/<name>.png (RGBA, trimmed)
plus check sheets on dark and light backgrounds in <raw_dir>/cutouts/_check/.
"""
import sys, pathlib
from PIL import Image
from rembg import remove, new_session

raw = pathlib.Path(sys.argv[1])
model = sys.argv[2] if len(sys.argv) > 2 else 'isnet-general-use'
only = sys.argv[3:]  # optional subset of names
session = new_session(model)
out = raw / 'cutouts'; check = out / '_check'
out.mkdir(exist_ok=True); check.mkdir(exist_ok=True)
for src in sorted((raw / 'source').iterdir()):
    if src.name.startswith('.') or (only and src.stem not in only):
        continue
    im = Image.open(src).convert('RGBA')
    cut = remove(im, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240,
                 alpha_matting_background_threshold=15, alpha_matting_erode_size=8, post_process_mask=True)
    bbox = cut.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    cut = cut.crop(bbox)
    cut.save(out / f'{src.stem}.png')
    for name, color in (('dark', (22, 7, 9, 255)), ('light', (255, 251, 236, 255))):
        bg = Image.new('RGBA', cut.size, color); bg.alpha_composite(cut); bg.convert('RGB').save(check / f'{src.stem}-{name}.jpg', quality=92)
    print(src.name, im.size, '->', cut.size)
