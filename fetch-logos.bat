\
@echo off
powershell -ExecutionPolicy Bypass -File ".\fetch-logos.ps1"
echo.
echo ==== Terminé. Les fichiers SVG sont dans assets\brands ====
pause
