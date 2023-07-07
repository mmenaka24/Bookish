import "dotenv/config";
import pgp from "pg-promise";

const db = pgp()(process.env.DATABASE_URL || "");

export default db;
