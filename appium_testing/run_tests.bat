@echo off
title Smart Food Waste Appium E2E Runner
echo ==================================================================
echo       SMART FOOD WASTE - APPIUM E2E AUTOMATED TEST RUNNER
echo ==================================================================
echo.

:: Verify Node.js is present
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not recognized as a command.
    echo Please install Node.js from https://nodejs.org/ first.
    echo.
    pause
    exit /b 1
)

echo [STEP 1/2] Installing NPM package dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install package dependencies.
    echo.
    pause
    exit /b 1
)
echo [INFO] Dependencies verified.
echo.

echo [STEP 2/2] Running E2E Test Suite...
echo.
node e2e_test.js
echo.
echo ==================================================================
echo Test Runner finished execution.
echo Please review generated reports inside the "reports/" directory.
echo ==================================================================
pause
