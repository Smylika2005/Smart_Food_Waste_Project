# Smart Food Waste Management System

A Flutter-based application designed to manage, predict, and reduce food waste in food service facilities. The system is equipped with robust end-to-end (E2E) automated testing suites for both mobile (Android Appium) and web (Selenium) environments, generating styled Excel dashboard reports for regression analysis.

---

## 🚀 Repository & CI/CD Status

*   **GitHub Repository**: [https://github.com/Smylika2005/Smart_Food_Waste_Project](https://github.com/Smylika2005/Smart_Food_Waste_Project)
*   **Default Branch**: `main`
*   **GitHub Actions CI Status**: [smart_food_waste_ci.yml](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/.github/workflows/smart_food_waste_ci.yml) validates all Flutter code analysis, runs unit tests, and verifies the automated test suite runner logic on every push.

---

## 🛠️ Codebase & File Directory Links

All primary codebase and automation assets are directly accessible via the links below:

### 📱 Core Flutter Application
*   [lib/main.dart](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/lib/main.dart) - Application Entry Point
*   [lib/login_page.dart](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/lib/login_page.dart) - Authentication & Login Page
*   [lib/food_menu_page.dart](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/lib/food_menu_page.dart) - CRUD Food Item Records Page
*   [lib/dashboard_page.dart](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/lib/dashboard_page.dart) - Analytics Dashboard Page
*   [lib/recommendation_page.dart](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/lib/recommendation_page.dart) - AI recommendation suggestions page
*   [test/widget_test.dart](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/test/widget_test.dart) - Flutter login smoke test file

### 🧪 End-to-End Testing Suites

| Target Platform | Technology Suite | Workspace Folder | Excel Reporter File |
| :--- | :--- | :--- | :--- |
| **Android Mobile** | NodeJS + WebdriverIO (Appium) | [appium_testing/](https://github.com/Smylika2005/Smart_Food_Waste_Project/tree/main/appium_testing) | [excel_reporter.js](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/appium_testing/excel_reporter.js) |
| **Android Mobile** | Python + openpyxl (Appium) | [appium_testing_python/](https://github.com/Smylika2005/Smart_Food_Waste_Project/tree/main/appium_testing_python) | [excel_reporter.py](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/appium_testing_python/excel_reporter.py) |
| **Web Browser** | NodeJS + Webdriver (Selenium) | [selenium_testing/](https://github.com/Smylika2005/Smart_Food_Waste_Project/tree/main/selenium_testing) | [excel_reporter.js](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/selenium_testing/excel_reporter.js) |

---

## ⚡ Root Launchers (Double-Click Execution)

To easily trigger E2E tests, run the Windows batch scripts located in the root repository:
*   [run_python_appium_tests.bat](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/run_python_appium_tests.bat) - Executes Python Appium E2E Automation
*   [run_appium_tests.bat](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/run_appium_tests.bat) - Executes Node.js Appium E2E Automation
*   [run_selenium_tests.bat](https://github.com/Smylika2005/Smart_Food_Waste_Project/blob/main/run_selenium_tests.bat) - Executes Node.js Selenium Web Automation
