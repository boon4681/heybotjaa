import type { Services } from "@boon4681/giri";
import { initDb, closeDb, getConn } from "./db";

export const init = () => {
    initDb();
    return { conn: getConn() };
};

export const teardown = () => {
    closeDb();
};
