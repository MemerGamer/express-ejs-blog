import db from "../db/db.js";

async function getAll() {
  try {
    const conn = db.getConnection();
    const [rows, _columns] = await conn.query(`SELECT * FROM Categories`);
    // console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default { getAll };
