#!/usr/bin/env bash
set -euo pipefail
mkdir -p "assets/brands"
cd assets/brands
echo "Fetching apple.svg ..."; curl -L -o "apple.svg" "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
echo "Fetching samsung.svg ..."; curl -L -o "samsung.svg" "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"
echo "Fetching xiaomi.svg ..."; curl -L -o "xiaomi.svg" "https://upload.wikimedia.org/wikipedia/commons/4/40/Xiaomi_logo_%282021-%29.svg"
echo "Fetching huawei.svg ..."; curl -L -o "huawei.svg" "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg"
echo "Fetching oppo.svg ..."; curl -L -o "oppo.svg" "https://upload.wikimedia.org/wikipedia/commons/3/3f/OPPO_LOGO_2019.svg"
echo "Fetching oneplus.svg ..."; curl -L -o "oneplus.svg" "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_copy-01.svg"
echo "Fetching google-pixel.svg ..."; curl -L -o "google-pixel.svg" "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
echo "Fetching sony.svg ..."; curl -L -o "sony.svg" "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg"
echo "Fetching nokia.svg ..."; curl -L -o "nokia.svg" "https://upload.wikimedia.org/wikipedia/commons/3/32/Nokia_-_2005_logo.svg"
echo "Fetching motorola.svg ..."; curl -L -o "motorola.svg" "https://upload.wikimedia.org/wikipedia/commons/d/de/Motorola.svg"
echo "Fetching asus.svg ..."; curl -L -o "asus.svg" "https://upload.wikimedia.org/wikipedia/commons/6/6e/AsusTek-black-logo.svg"
echo "Fetching realme.svg ..."; curl -L -o "realme.svg" "https://upload.wikimedia.org/wikipedia/commons/a/a2/Realme_logo.svg"
echo "Fetching honor.svg ..."; curl -L -o "honor.svg" "https://upload.wikimedia.org/wikipedia/commons/2/20/Honor_Logo_%282020%29.svg"
