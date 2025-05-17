import { withConnection } from "./shared/database.js";

export async function transactions_pagination() {
  // get a fix amount of transactions

  const limit = 10; // transactions per page
  let offset = 0; // start after x amount of rows (zero means the 1st row)

  // if the user has the
  const query = `SELECT * FROM transactions
      WHERE user_id = ? LIMIT  ? OFFSET ?`;

  return await withConnection(async (connection) => {
    const [result] = await connection.query(query, [1, limit, offset]);
    return result;
  });
}

console.log(await transactions_pagination());
