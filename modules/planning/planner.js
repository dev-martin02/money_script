import { find_day, month_dates } from "../month-calculation/month.js";

// Makes a map of all your expenses for the month
export function month_planner(user_expenses) {
  const today = new Date();
  const current_month = today.getMonth();
  const current_year = today.getFullYear();

  const current_month_info = month_dates(current_year, current_month);

  const planner_month = create_planner(current_month_info);

  const user_payment_month = {};

  // modify the obj, containing a map of all the days the user will have to pay his bills
  user_expenses.forEach((expenses) => {
    if (expenses.frequency === "monthly") {
      const day_to_find = find_day(expenses.dueDate, planner_month);

      if (user_payment_month[day_to_find[0]] === undefined) {
        user_payment_month[day_to_find[0]] = [];
      }

      const monthly_Obj = {
        name: expenses.name,
        cost: expenses.cost,
        dueDate: expenses.dueDate,
      };

      user_payment_month[day_to_find[0]].push(monthly_Obj);
    }

    if (expenses.frequency === "weekly") {
      for (let i = 0; i < 5; i++) {
        if (user_payment_month[i] === undefined) {
          user_payment_month[i] = [];
        }
        const monthly_Obj = {
          name: expenses.name,
          cost: expenses.cost,
          dueDate: expenses.dueDate,
        };

        user_payment_month[i].push(monthly_Obj);
      }
    }

    if (expenses.frequency === "bi-weekly") {
      const day_to_find = find_day(expenses.dueDate, planner_month);
      if (user_payment_month[day_to_find[0]] === undefined) {
        user_payment_month[day_to_find[0]] = [];
      } else if (user_payment_month[day_to_find[0] + 2] === undefined) {
        user_payment_month[day_to_find[0] + 2] = [];
      }

      const monthly_Obj = {
        name: expenses.name,
        cost: expenses.cost,
        dueDate: expenses.dueDate,
      };
      user_payment_month[day_to_find[0]].push(monthly_Obj);

      user_payment_month[day_to_find[0] + 2].push(monthly_Obj);
    }
  });

  return user_payment_month;
}

// Return an Obj with the days of the months breakdown in weeks
export function create_planner(month_info) {
  const weeks = month_info.length / 7;
  let last_week_day = 0;
  let first_week_day = 0;

  let weeks_in_month = {};

  for (let i = 0; i < weeks; i++) {
    last_week_day += 7;
    if (first_week_day === 0) {
      weeks_in_month[i] = month_info.slice(first_week_day, last_week_day);
      first_week_day += 7;
    } else {
      weeks_in_month[i] = month_info.slice(first_week_day, last_week_day);
      first_week_day += 7;
    }
  }
  return weeks_in_month;
}
