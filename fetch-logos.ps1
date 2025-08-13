# PowerShell
New-Item -ItemType Directory -Force -Path assets\brands | Out-Null
Set-Location assets\brands
Write-Host "Fetching apple.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" -OutFile "apple.svg"
Write-Host "Fetching samsung.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" -OutFile "samsung.svg"
Write-Host "Fetching xiaomi.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/4/40/Xiaomi_logo_%282021-%29.svg" -OutFile "xiaomi.svg"
Write-Host "Fetching huawei.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg" -OutFile "huawei.svg"
Write-Host "Fetching oppo.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/3/3f/OPPO_LOGO_2019.svg" -OutFile "oppo.svg"
Write-Host "Fetching oneplus.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_copy-01.svg" -OutFile "oneplus.svg"
Write-Host "Fetching google-pixel.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" -OutFile "google-pixel.svg"
Write-Host "Fetching sony.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" -OutFile "sony.svg"
Write-Host "Fetching nokia.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/3/32/Nokia_-_2005_logo.svg" -OutFile "nokia.svg"
Write-Host "Fetching motorola.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/d/de/Motorola.svg" -OutFile "motorola.svg"
Write-Host "Fetching asus.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/6/6e/AsusTek-black-logo.svg" -OutFile "asus.svg"
Write-Host "Fetching realme.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/a/a2/Realme_logo.svg" -OutFile "realme.svg"
Write-Host "Fetching honor.svg ..."; Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/2/20/Honor_Logo_%282020%29.svg" -OutFile "honor.svg"
