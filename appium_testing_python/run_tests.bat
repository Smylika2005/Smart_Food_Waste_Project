@echo off
title Smart Food Waste — Python Appium E2E Test Runner
echo ==================================================================
echo       SMART FOOD WASTE — PYTHON APPIUM E2E TEST RUNNER
echo ==================================================================
echo.

:: Check Python/Py
where py >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=py
) else (
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python
    ) else (
        echo [ERROR] Python is not installed or not in PATH.
        echo Please install from https://www.python.org/
        pause
        exit /b 1
    )
)

:: Install dependencies
echo [STEP] Checking/Installing Python dependencies from requirements.txt...
%PYTHON_CMD% -m pip install -r requirements.txt
echo.

:: Run the tests
echo [STEP] Running Python Appium E2E Test Suite (110 Test Cases)...
echo.
%PYTHON_CMD% e2e_test.py

echo.
echo ==================================================================
echo Done! Check the "reports\" folder for Excel report.
echo ==================================================================
pause
