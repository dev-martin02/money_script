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
