# gen-og-image.py —— 生成静态 OG 分享图（public/og.png，1200x630）
#
# 运行：python scripts/gen-og-image.py
# 风格与分享卡一致：黑底、白字、灰辅助、等宽字体、分隔线。
# 字体使用 Windows 自带的 Consolas（等宽科技感）与微软雅黑（中文）。

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY = (115, 115, 115)       # neutral-500
DARK_GRAY = (64, 64, 64)     # neutral-700
LINE = (38, 38, 38)          # neutral-800

FONT_MONO = r"C:\Windows\Fonts\consola.ttf"
FONT_MONO_BOLD = r"C:\Windows\Fonts\consolab.ttf"
FONT_CJK = r"C:\Windows\Fonts\msyh.ttc"

img = Image.new("RGB", (W, H), BLACK)
d = ImageDraw.Draw(img)

mono_sm = ImageFont.truetype(FONT_MONO, 26)
mono_lg = ImageFont.truetype(FONT_MONO_BOLD, 150)
mono_md = ImageFont.truetype(FONT_MONO_BOLD, 64)
cjk_sm = ImageFont.truetype(FONT_CJK, 28)

M = 72  # 页边距

# ---- 顶部边栏 ----
d.text((M, 56), "CLOSEAI.MOE", font=mono_sm, fill=GRAY)
right = "AI PROXIMITY TEST"
w_right = d.textlength(right, font=mono_sm)
d.text((W - M - w_right, 56), right, font=mono_sm, fill=GRAY)

# 分隔线
d.line([(M, 110), (W - M, 110)], fill=LINE, width=2)

# ---- 中央：四个字母方块（? ? ? ?） ----
blocks = ["?", "?", "?", "?"]
block_font = mono_lg
gap = 48
div_h = 110
total_w = sum(d.textlength(b, font=block_font) for b in blocks) + gap * 3 + 3 * 26
x = (W - total_w) / 2
y = 170
for i, b in enumerate(blocks):
    d.text((x, y), b, font=block_font, fill=WHITE)
    x += d.textlength(b, font=block_font)
    if i < 3:
        x += gap / 2
        d.line([(x, y + 20), (x, y + 20 + div_h)], fill=LINE, width=2)
        x += 26 + gap / 2

# ---- 主标语 ----
slogan1 = "How Close Are You"
slogan2 = "to AI?"
w1 = d.textlength(slogan1, font=mono_md)
w2 = d.textlength(slogan2, font=mono_md)
d.text(((W - w1) / 2, 390), slogan1, font=mono_md, fill=WHITE)
d.text(((W - w2) / 2, 465), slogan2, font=mono_md, fill=GRAY)

# ---- 底部 ----
d.line([(M, 545), (W - M, 545)], fill=LINE, width=2)
d.text((M, 568), "closeai.moe", font=mono_sm, fill=WHITE)
hint = "8 题 · 4 字母 · 1 个判决"
w_hint = d.textlength(hint, font=cjk_sm)
d.text((W - M - w_hint, 566), hint, font=cjk_sm, fill=DARK_GRAY)

img.save("public/og.png", "PNG")
print("[done] public/og.png", img.size)
