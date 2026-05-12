import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DBURL,
  ssl: { rejectUnauthorized: true },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
