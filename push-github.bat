@echo off
setlocal
cd /d "%~dp0"

git status >nul 2>nul
if errorlevel 1 (
  git init
)

git branch -M main
git add .
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Initial fortune card web game"
)

gh auth status
if errorlevel 1 (
  echo.
  echo GitHub CLI is not logged in. Run:
  echo gh auth login -h github.com -w
  exit /b 1
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  gh repo create fortune-card-game --public --source . --remote origin --push
) else (
  git push -u origin main
)
