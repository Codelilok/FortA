import { pool } from "@workspace/db";

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      sid varchar NOT NULL,
      sess json NOT NULL,
      expire timestamp(6) NOT NULL,
      CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS IDX_session_expire ON user_sessions (expire)
  `);
  console.log("user_sessions table ready");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
