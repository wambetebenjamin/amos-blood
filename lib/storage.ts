import { initialDatabase, type Database } from "@/lib/types";

const DB_KEY = "amos_blood_db_v1";

const isKvConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

type GlobalWithStore = typeof globalThis & {
  __amosBloodDb?: Database;
};

const globalStore = globalThis as GlobalWithStore;

async function kvClient() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

async function readFromKv(): Promise<Database | null> {
  try {
    const kv = await kvClient();
    const data = await kv.get<Database>(DB_KEY);
    return data ?? null;
  } catch (error) {
    console.error("[storage] KV read failed, using memory store", error);
    return null;
  }
}

async function writeToKv(db: Database) {
  try {
    const kv = await kvClient();
    await kv.set(DB_KEY, db);
  } catch (error) {
    console.error("[storage] KV write failed, state kept in memory", error);
  }
}

export async function readDb(): Promise<Database> {
  if (isKvConfigured) {
    const existing = await readFromKv();
    if (existing) {
      return existing;
    }
    const seeded = initialDatabase();
    await writeToKv(seeded);
    return seeded;
  }

  if (!globalStore.__amosBloodDb) {
    globalStore.__amosBloodDb = initialDatabase();
  }
  return globalStore.__amosBloodDb;
}

export async function writeDb(db: Database): Promise<void> {
  if (isKvConfigured) {
    await writeToKv(db);
    return;
  }
  globalStore.__amosBloodDb = db;
}

export async function updateDb(
  mutate: (db: Database) => void | Promise<void>,
): Promise<Database> {
  const db = await readDb();
  await mutate(db);
  await writeDb(db);
  return db;
}

export function storageMode() {
  return isKvConfigured ? "vercel-kv" : "memory";
}
