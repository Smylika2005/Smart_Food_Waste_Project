@echo off
title Smart Food Waste — Selenium E2E Test Runner
echo ==================================================================
echo       SMART FOOD WASTE — SELENIUM E2E TEST RUNNER (ROOT LAUNCHER)
echo ==================================================================
echo.

:: Move into the correct selenium_testing directory
:: %~dp0 = folder where this .bat file lives (includes trailing backslash)
cd /d "%~dp0selenium_testing"

echo [INFO] Working directory: %CD%
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if node_modules missing
if not exist "node_modules" (
    echo [STEP] Installing NPM dependencies...
    call npm install
    echo.
)

:: Run the tests
echo [STEP] Running Selenium E2E Test Suite (110 Test Cases)...
echo.
node e2e_selenium_test.js

echo.
echo ==================================================================
echo Done! Check the "selenium_testing\reports\" folder for Excel report.
echo ==================================================================
pause
