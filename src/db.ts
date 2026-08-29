import * as duckdb from "duckdb";
import * as fs from "fs";
import * as path from "path";

const dbPath = path.join(process.cwd(), "data", "heybot.duckdb");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new duckdb.Database(dbPath);
const conn = db.connect();

export function initDb() {
    conn.run(`
    CREATE TABLE IF NOT EXISTS agents (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      created_at VARCHAR NOT NULL
    )
  `);

    conn.run(`CREATE SEQUENCE IF NOT EXISTS services_id_seq`);

    conn.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY DEFAULT nextval('services_id_seq'),
      name VARCHAR NOT NULL,
      agent_id VARCHAR NOT NULL,
      created_at VARCHAR NOT NULL,
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    )
  `);

    return conn;
}

export function getConn() {
    return conn;
}

export function closeDb() {
    conn.close();
    db.close();
}
