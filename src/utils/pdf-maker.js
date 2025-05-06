import fs from "node:fs";
import PdfPrinter from "pdfmake";

const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Bold.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-BoldItalic.ttf",
  },
};

// Create PdfPrinter instance with fonts
const printer = new PdfPrinter(fonts);

export function pdf_maker(data, remainingMoney) {
  // Calculate total expenses for each week and overall
  function calculateTotals() {
    const totals = {};
    let grandTotal = 0;

    Object.entries(data).forEach(([week, items]) => {
      const weekTotal = items.reduce((sum, item) => sum + item.cost, 0);
      totals[week] = weekTotal;
      grandTotal += weekTotal;
    });

    return { weeklyTotals: totals, grandTotal };
  }

  const { weeklyTotals, grandTotal } = calculateTotals();

  // Helper function to capitalize text and replace underscores with spaces
  function capitalize(str) {
    return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Helper function to format currency
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  // Helper to format due dates consistently
  function formatDueDate(dueDate) {
    if (typeof dueDate === "number") {
      return `Day ${dueDate}`;
    } else {
      return capitalize(dueDate);
    }
  }

  // Define a color palette for better visual design
  const colors = {
    primary: "#1976D2",
    secondary: "#455A64",
    accent: "#FF5722",
    lightGray: "#F5F5F5",
    mediumGray: "#E0E0E0",
    darkGray: "#757575",
    positive: "#2E7D32",
    negative: "#C62828",
    headerBg: "#E3F2FD",
    tableBorder: "#BBDEFB",
    altRow: "#F5F7FA",
  };

  // Create header with current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Start building the document content
  let content = [
    {
      stack: [
        { text: "EXPENSE REPORT", style: "mainTitle" },
        { text: "Weekly Financial Summary", style: "subtitle" },
        { text: `Generated on ${formattedDate}`, style: "date" },
      ],
      margin: [0, 0, 0, 20],
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 515,
          y2: 5,
          lineWidth: 3,
          lineColor: colors.primary,
        },
      ],
      margin: [0, 0, 0, 20],
    },
  ];

  // Add overview section
  content.push(
    {
      text: "Financial Overview",
      style: "sectionHeader",
      margin: [0, 0, 0, 10],
    },
    {
      columns: [
        {
          width: "*",
          stack: [
            {
              table: {
                widths: ["*", "auto"],
                body: [
                  [
                    { text: "Total Expenses:", style: "overviewLabel" },
                    {
                      text: formatCurrency(grandTotal),
                      style: "overviewValue",
                    },
                  ],
                  [
                    { text: "Remaining Budget:", style: "overviewLabel" },
                    {
                      text: formatCurrency(remainingMoney),
                      style:
                        remainingMoney >= 0 ? "positiveValue" : "negativeValue",
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function () {
                  return 0;
                },
                vLineWidth: function () {
                  return 0;
                },
                paddingLeft: function () {
                  return 0;
                },
                paddingRight: function () {
                  return 0;
                },
                paddingTop: function () {
                  return 5;
                },
                paddingBottom: function () {
                  return 5;
                },
              },
            },
          ],
        },
        {
          width: "auto",
          stack: [
            {
              canvas: [
                {
                  type: "rect",
                  x: 0,
                  y: 0,
                  w: 150,
                  h: 40,
                  r: 5,
                  color:
                    remainingMoney >= 0 ? colors.positive : colors.negative,
                },
                {
                  type: "rect",
                  x: 2,
                  y: 2,
                  w: 146,
                  h: 36,
                  r: 4,
                  color: "#FFFFFF",
                },
              ],
              absolutePosition: { x: 350, y: 130 },
            },
            {
              text: remainingMoney >= 0 ? "BUDGET SURPLUS" : "BUDGET DEFICIT",
              style: "budgetStatus",
              color: remainingMoney >= 0 ? colors.positive : colors.negative,
              absolutePosition: { x: 370, y: 143 },
            },
          ],
        },
      ],
      margin: [0, 0, 0, 30],
    }
  );

  // Weekly expense details
  Object.entries(data).forEach(([week, items]) => {
    const weekNumber = parseInt(week) + 1;

    content.push({
      text: `Week ${weekNumber}`,
      style: "weekHeader",
      margin: [0, 10, 0, 10],
    });

    // Weekly summary row
    content.push({
      table: {
        widths: ["*", "auto"],
        body: [
          [
            {
              text: `Expenses for Week ${weekNumber}:`,
              style: "weeklySummaryLabel",
            },
            {
              text: formatCurrency(weeklyTotals[week]),
              style: "weeklySummaryValue",
            },
          ],
        ],
      },
      layout: {
        hLineWidth: function () {
          return 0;
        },
        vLineWidth: function () {
          return 0;
        },
        fillColor: colors.headerBg,
      },
      margin: [0, 0, 0, 10],
    });

    // If no expenses for this week
    if (items.length === 0) {
      content.push({
        text: "No expenses for this week.",
        style: "noExpenses",
        margin: [0, 0, 0, 15],
      });
      return;
    }

    // Create table for weekly expenses
    const tableBody = [
      [
        { text: "Expense", style: "tableHeader" },
        { text: "Amount", style: "tableHeader", alignment: "right" },
        { text: "Due Date", style: "tableHeader", alignment: "center" },
      ],
    ];

    items.forEach((item, index) => {
      tableBody.push([
        { text: capitalize(item.name), style: "tableCell" },
        {
          text: formatCurrency(item.cost),
          style: "tableCell",
          alignment: "right",
        },
        {
          text: formatDueDate(item.dueDate),
          style: "tableCell",
          alignment: "center",
        },
      ]);
    });

    content.push({
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto"],
        body: tableBody,
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function () {
          return 0;
        },
        hLineColor: function (i, node) {
          return i === 0 || i === node.table.body.length
            ? colors.primary
            : colors.tableBorder;
        },
        fillColor: function (rowIndex) {
          return rowIndex === 0
            ? colors.headerBg
            : rowIndex % 2 === 0
            ? colors.altRow
            : null;
        },
        paddingLeft: function (i) {
          return 8;
        },
        paddingRight: function (i) {
          return 8;
        },
        paddingTop: function (i) {
          return 8;
        },
        paddingBottom: function (i) {
          return 8;
        },
      },
      margin: [0, 0, 0, 20],
    });
  });

  // Add footer with summary
  content.push(
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 515,
          y2: 5,
          lineWidth: 1,
          lineColor: colors.mediumGray,
        },
      ],
      margin: [0, 20, 0, 10],
    },
    {
      text: "Budget Summary",
      style: "summaryTitle",
      margin: [0, 5, 0, 10],
    },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            {
              text: "Total Expenses",
              style: "summaryLabel",
              alignment: "center",
            },
            {
              text: "Remaining Money",
              style: "summaryLabel",
              alignment: "center",
            },
            { text: "Status", style: "summaryLabel", alignment: "center" },
          ],
          [
            {
              text: formatCurrency(grandTotal),
              style: "summaryValue",
              alignment: "center",
            },
            {
              text: formatCurrency(remainingMoney),
              style: "summaryValue",
              alignment: "center",
              color: remainingMoney >= 0 ? colors.positive : colors.negative,
            },
            {
              text: remainingMoney >= 0 ? "On Budget" : "Over Budget",
              style: "summaryStatus",
              alignment: "center",
              color: remainingMoney >= 0 ? colors.positive : colors.negative,
            },
          ],
        ],
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function () {
          return 0;
        },
        hLineColor: function (i, node) {
          return colors.primary;
        },
        fillColor: function (i) {
          return i === 0 ? colors.headerBg : null;
        },
      },
      margin: [0, 0, 0, 20],
    }
  );

  // Define document styles
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 60],
    content,
    styles: {
      mainTitle: {
        fontSize: 24,
        bold: true,
        color: colors.primary,
        alignment: "center",
      },
      subtitle: {
        fontSize: 16,
        color: colors.secondary,
        alignment: "center",
        margin: [0, 5, 0, 0],
      },
      date: {
        fontSize: 12,
        color: colors.darkGray,
        alignment: "center",
        margin: [0, 10, 0, 0],
        italics: true,
      },
      sectionHeader: {
        fontSize: 18,
        bold: true,
        color: colors.primary,
        margin: [0, 10, 0, 5],
      },
      weekHeader: {
        fontSize: 16,
        bold: true,
        color: colors.primary,
        decoration: "underline",
        decorationStyle: "solid",
        decorationColor: colors.primary,
      },
      tableHeader: {
        fontSize: 12,
        bold: true,
        color: colors.secondary,
      },
      tableCell: {
        fontSize: 11,
        color: colors.secondary,
      },
      overviewLabel: {
        fontSize: 14,
        bold: true,
        color: colors.secondary,
      },
      overviewValue: {
        fontSize: 14,
        bold: true,
        color: colors.primary,
      },
      positiveValue: {
        fontSize: 14,
        bold: true,
        color: colors.positive,
      },
      negativeValue: {
        fontSize: 14,
        bold: true,
        color: colors.negative,
      },
      weeklySummaryLabel: {
        fontSize: 12,
        bold: true,
        color: colors.secondary,
      },
      weeklySummaryValue: {
        fontSize: 12,
        bold: true,
        color: colors.primary,
      },
      noExpenses: {
        fontSize: 11,
        italics: true,
        color: colors.darkGray,
      },
      budgetStatus: {
        fontSize: 12,
        bold: true,
      },
      summaryTitle: {
        fontSize: 16,
        bold: true,
        color: colors.primary,
        alignment: "center",
      },
      summaryLabel: {
        fontSize: 12,
        bold: true,
        color: colors.secondary,
      },
      summaryValue: {
        fontSize: 14,
        bold: true,
      },
      summaryStatus: {
        fontSize: 14,
        bold: true,
      },
    },
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            text: "Personal Expense Manager",
            alignment: "left",
            margin: [40, 0, 0, 0],
            color: colors.darkGray,
            fontSize: 10,
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            margin: [0, 0, 40, 0],
            color: colors.darkGray,
            fontSize: 10,
          },
        ],
        margin: [40, 20, 40, 0],
      };
    },
  };

  // Generate the PDF document
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream("enhanced_expense_report.pdf"));
  pdfDoc.end();

  console.log("Enhanced expense report generated successfully!");
}
