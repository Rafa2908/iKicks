import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DBURL,
  ssl: { rejectUnauthorized: false },
});

try {
  pool.connect();
  console.log("DB connected successfully");
} catch (error) {
  console.error(error);
}

export default pool;
