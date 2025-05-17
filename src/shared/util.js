export async function paginate({
  connection,
  baseQuery,
  filters = {},
  params = [],
  sort = "",
  page = 1,
  limit = 10,
}) {
  const offset = (page - 1) * limit;

  // Build WHERE clause from filters
  const filterKeys = Object.keys(filters);
  let whereClause = "";
  if (filterKeys.length > 0) {
    const conditions = filterKeys.map((key) => `${key} = ?`);
    whereClause = "WHERE " + conditions.join(" AND ");
    params = [...params, ...Object.values(filters)];
  }

  // Main paginated query
  const finalQuery = `
    ${baseQuery}
    ${whereClause}
    ${sort ? "ORDER BY " + sort : ""}
    LIMIT ? OFFSET ?
  `;
  const finalParams = [...params, limit, offset];

  // Count query
  const countQuery = `
    SELECT COUNT(*) as total
    FROM (${baseQuery} ${whereClause}) as count_table
  `;

  const [[countRow]] = await connection.execute(countQuery, params);
  const [rows] = await connection.execute(finalQuery, finalParams);

  return {
    data: rows,
    total: countRow.total,
    page,
    totalPages: Math.ceil(countRow.total / limit),
  };
}
