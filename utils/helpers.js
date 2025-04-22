export function parse_expense(text) {
  const fields = text.split(",").map((item) => item.trim());

  const expense = {};

  for (const field of fields) {
    const [rawKey, rawValue] = field.split(": ").map((str) => str.trim());

    let value;
    switch (rawKey) {
      case "cost":
        value = parseFloat(rawValue.replace("$", ""));
        break;
      case "dueDate":
        value = parseInt(rawValue);
        if (isNaN(value)) {
          value = rawValue;
        }
        break;
      default:
        value = rawValue;
    }

    expense[rawKey] = value;
  }

  return expense;
}
