@echo off
chcp 65001 >nul
title Bazi Numerology Assistant
cd /d "%~dp0"
node src/cli/baziCli.js
pause