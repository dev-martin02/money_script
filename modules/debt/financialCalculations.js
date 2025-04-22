export function available_money_monthly(user_expenses, user_pay_check) {
  let total_expenses_sum = 0;
  user_expenses.forEach((bill) => {
    if (!bill)
      if (bill.frequency === "bi-weekly") {
        total_expenses_sum += bill.cost * 2;
      } else if (bill.frequency === "weekly") {
        total_expenses_sum += bill.cost * 4;
      }
  });

  const after_expenses = user_pay_check - total_expenses_sum;

  return after_expenses;
}

// Functionality in process...
export function user_action(focus_on, user_money) {
  // Take an aggressive approach towards paying your debt 80% of you income
  if (focus_on === "debt") {
    const payment_towards_debt = user_money * 0.8;
    console.log("Money towards the smallest debt", payment_towards_debt);
    console.log(
      `User have $${Math.floor(
        user_money - payment_towards_debt
      )} left to save for emergency`
    );
  }
}
