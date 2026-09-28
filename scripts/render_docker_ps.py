from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont


def main() -> None:
    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    lines = ["$ docker ps", *source.read_text(encoding="utf-8").splitlines()]

    font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
    font = ImageFont.truetype(font_path, 20)
    line_height = 32
    padding = 36
    width = max(1280, max(font.getlength(line) for line in lines).__ceil__() + padding * 2)
    height = padding * 2 + line_height * len(lines)

    image = Image.new("RGB", (width, height), "#0d1117")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((14, 14, width - 14, height - 14), 16, fill="#161b22", outline="#30363d", width=2)

    for index, line in enumerate(lines):
        color = "#7ee787" if index == 0 else "#e6edf3"
        draw.text((padding, padding + index * line_height), line, font=font, fill=color)

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, format="PNG", optimize=True)


if __name__ == "__main__":
    main()

