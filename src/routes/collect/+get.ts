import { zod } from "@boon4681/giri/validators/zod";
import { z } from "zod";
import type { GET } from "./$types";

export const query = zod.query(
    z.object({
        agentId: z.string().min(1),
        agentName: z.string().min(1),
        serviceName: z.string().min(1),
    })
);

export const handle: GET = async (c) => {
    const { agentId, agentName, serviceName } = c.req.valid("query");
    const conn = c.app.conn;
    const now = new Date().toISOString();

    await new Promise<void>((resolve, reject) => {
        conn.run(
            `INSERT INTO agents (id, name, created_at) VALUES (?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET name = excluded.name`,
            agentId,
            agentName,
            now,
            (err: Error | null) => (err ? reject(err) : resolve())
        );
    });

    await new Promise<void>((resolve, reject) => {
        conn.run(
            `INSERT INTO services (name, agent_id, created_at) VALUES (?, ?, ?)`,
            serviceName,
            agentId,
            now,
            (err: Error | null) => (err ? reject(err) : resolve())
        );
    });

    return c.json({ ok: true });
};
