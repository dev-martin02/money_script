# TODO: Transaction Analytics & Enhancements

## Existing Implementations
- [x] **monthly_totals(id)**  
  Get total income and expense for the current month.
- [x] **weekly_monthly(id)**  
  Get weekly income and expense for the current month.
- [x] **monthly_yearly(id)**  
  Get monthly income and expense for the current year.

---

## Next Steps & Ideas

### 1. Category Breakdown
- [ ] Implement function to get totals per category for a user (for pie/donut charts).
  - **Step 1:** Write SQL query grouping by category_id and joining with categories table for names.
  - **Step 2:** Add new function in `calculations.js`.
  - **Step 3:** Return results for current month/year or custom range.

### 2. Payment Method Analysis
- [ ] Implement function to aggregate totals by payment method.
  - **Step 1:** Write SQL query grouping by `method`.
  - **Step 2:** Add function in `calculations.js`.
  - **Step 3:** Return results for selected period.

### 3. Top Spending/Income Sources
- [ ] List top categories or places where the user spends/earns most.
  - **Step 1:** Write SQL query ordering by SUM(amount) DESC, limit results.
  - **Step 2:** Add function for top N categories/places.

### 4. Cash Flow Over Time
- [ ] Calculate net cash flow (income - expense) per week/month.
  - **Step 1:** Use existing weekly/monthly queries, add net calculation.
  - **Step 2:** Add function to return net cash flow.

### 5. Recurring Transactions Detection
- [ ] Identify recurring transactions (subscriptions, salary, etc.).
  - **Step 1:** Analyze transactions for similar amounts/descriptions at regular intervals.
  - **Step 2:** Add function to flag recurring transactions.

### 6. Custom Date Range Queries
- [ ] Allow users to select any date range for analytics.
  - **Step 1:** Update queries to accept start and end dates.
  - **Step 2:** Add parameters to functions.

### 7. Spending by Place
- [ ] Aggregate expenses by the `place` field.
  - **Step 1:** Write SQL query grouping by `place`.
  - **Step 2:** Add function for place-based analytics.

### 8. Average Transaction Size
- [ ] Calculate average income/expense transaction size.
  - **Step 1:** Write SQL query using AVG(amount).
  - **Step 2:** Add function for average calculation.

### 9. Biggest/Smallest Transactions
- [ ] Find the largest and smallest transactions for a period.
  - **Step 1:** Write SQL query ordering by amount DESC/ASC, limit 1.
  - **Step 2:** Add function to return these transactions.

---

## General Steps for Each Feature
1. Design the SQL query for the required analytics.
2. Add a new async function in `calculations.js` to execute the query.
3. Test the function with sample data.
4. Integrate the function into the frontend or API as needed.
5. Update documentation and UI to display new analytics/graphs.

---

Feel free to check off items as you complete them!