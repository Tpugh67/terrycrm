from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
bg_color = (20, 38, 92)

canvas = Image.new("RGB", (W, H), bg_color)
draw = ImageDraw.Draw(canvas)

logo = Image.open("public/brand/pipedesk-logo.png").convert("RGBA")
logo_size = 340
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
logo_x = 70
logo_y = (H - logo_size) // 2
canvas.paste(logo, (logo_x, logo_y), logo)

font_bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 78)
font_regular = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26)

text_x = logo_x + logo_size + 50
max_text_width = W - text_x - 40

print("text_x =", text_x)
print("max_text_width =", max_text_width)

tagline = "The multi-industry CRM built for how you sell"
full_bbox = draw.textbbox((0, 0), tagline, font=font_regular)
print("full tagline width =", full_bbox[2] - full_bbox[0])

draw.text((text_x, 220), "PipeDesk", font=font_bold, fill=(255, 255, 255))

words = tagline.split()
lines = []
current_line = ""
for word in words:
    test_line = (current_line + " " + word).strip()
    bbox = draw.textbbox((0, 0), test_line, font=font_regular)
    line_width = bbox[2] - bbox[0]
    print("testing:", repr(test_line), "width:", line_width)
    if line_width > max_text_width and current_line:
        lines.append(current_line)
        current_line = word
    else:
        current_line = test_line
if current_line:
    lines.append(current_line)

print("FINAL LINES:", lines)

y = 330
for line in lines:
    draw.text((text_x, y), line, font=font_regular, fill=(190, 205, 235))
    y += 40

canvas.save("public/brand/pipedesk-og-image.png")
