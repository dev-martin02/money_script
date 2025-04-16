// Returns an Array with all the info of the month (day,date,month,year)
export function month_dates(year, month) {
  const dates_arr = [];
  const month_dates = new Date(year, month + 1, 0); // We sum 1 so we can get all the days from this month

  for (let date = 1; date <= month_dates.getDate(); date++) {
    const date_Obj = {};
    const this_month_info = new Date(year, month, date);
    date_Obj["day"] = this_month_info.getDay();
    date_Obj["date"] = this_month_info.getDate();
    date_Obj["month"] = this_month_info.getMonth();
    date_Obj["year"] = this_month_info.getFullYear();

    dates_arr.push(date_Obj);
  }
  return dates_arr;
}

export function find_day(date, target) {
  const index_days = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const obj_to_arr = Object.values(target);

  let week_to_find;
  for (const week of obj_to_arr) {
    if (typeof date === "string") {
      const day_of_week = index_days[date];
      week_to_find = week.find((data) => data.day === day_of_week);
    } else {
      week_to_find = week.find((data) => data.date === date);
    }

    if (week_to_find) {
      const week_location = obj_to_arr.indexOf(week);
      return [week_location, week_to_find];
    }
  }
  return "Sorry your day wasn't found";
}
