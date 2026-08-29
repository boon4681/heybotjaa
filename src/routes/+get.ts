import type { Handle } from "@boon4681/giri";

interface Row {
    agent_id: string;
    agent_name: string;
    service_name: string | null;
    called_at: string | null;
}

export const handle: Handle = async (c) => {
    const conn = c.app.conn;

    const rows = await new Promise<Row[]>((resolve, reject) => {
        conn.all(
            `SELECT a.id as agent_id, a.name as agent_name,
              s.name as service_name, s.created_at as called_at
       FROM agents a
       LEFT JOIN services s ON s.agent_id = a.id
       ORDER BY a.id, s.created_at DESC`,
            (err: Error | null, result: unknown) => (err ? reject(err) : resolve(result as Row[]))
        );
    });

    const agents = new Map<string, { id: string; name: string; services: { name: string; calledAt: string }[] }>();
    for (const row of rows) {
        if (!agents.has(row.agent_id)) {
            agents.set(row.agent_id, { id: row.agent_id, name: row.agent_name, services: [] });
        }
        if (row.service_name) {
            agents.get(row.agent_id)!.services.push({ name: row.service_name, calledAt: row.called_at! });
        }
    }

    return c.json({ agents: Array.from(agents.values()) });
};
