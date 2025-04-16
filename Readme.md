# Money Script

Money Script is a personal finance management tool designed to help users plan their monthly expenses, track their remaining budget, and generate detailed financial reports in PDF format.

## Features

- **Monthly Expense Planner**: Automatically organizes user expenses into a weekly breakdown.
- **Debt Management**: Calculates remaining money after expenses and provides insights for debt repayment.
- **PDF Report Generation**: Creates a visually appealing and detailed PDF report of the user's financial summary.
- **Customizable Expense Frequencies**: Supports monthly, weekly, and bi-weekly expense tracking.

## Project Structure

```
money_script/
├── enhanced_expense_report.pdf # Generated PDF report
├── index.js # Main entry point of the application
├── package.json # Project dependencies and scripts
├── Readme.md # Project documentation
├── fonts/ # Font files for PDF generation
│ ├── Roboto-Bold.ttf
│ ├── Roboto-BoldItalic.ttf
│ ├── Roboto-Italic.ttf
│ └── Roboto-Regular.ttf
├── modules/ # Core modules for calculations and planning
│ ├── debt/
│ │ └── financialCalculations.js
│ ├── month-calculation/
│ │ └── month.js
│ └── planning/
│ └── planner.js
└── utils/
└── pdf-maker.js # Utility for generating PDF reports

```

## How It Works

1. **Input Data**: The app takes user income, expenses, and debts as input in `index.js`.
2. **Expense Planning**:
   - The `planner.js` module organizes expenses into weekly breakdowns.
   - The `month.js` module generates detailed date information for the current month.
3. **Debt Calculation**:
   - The `financialCalculations.js` module calculates the remaining money after expenses.
4. **PDF Report Generation**:
   - The `pdf-maker.js` utility generates a detailed PDF report summarizing the user's financial data.
5. **Output**: The app generates an `enhanced_expense_report.pdf` file in the root directory.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd money_script
   ```
2. Install dependencies:
   ```
    npm install
   ```

## Usage

1. Update the `user_pay_check`, `user_expenses`, and `user_debt` variables in `index.js` with your financial data.
2. Run the application:
   ```
    node index.js
   ```
3. The generated PDF report will be saved as `enhanced_expense_report.pdf` in the root directory.

## Dependencies

- [pdfmake](https://www.npmjs.com/package/pdfmake): For generating PDF reports.
- [nodemailer](https://www.npmjs.com/package/nodemailer): (Currently unused but included for potential email functionality).

## Example Output

The generated PDF report includes:

- A financial overview with total expenses and remaining budget.
- Weekly breakdown of expenses with due dates and amounts.
- A summary section highlighting the user's financial status.

## Future Improvements

- Add email functionality to send the PDF report directly to the user.
- Support for additional expense frequencies (e.g., quarterly, yearly).
- Enhanced debt repayment strategies and recommendations.

## License

This project is licensed under the ISC License.

## Author

Martin Morel
