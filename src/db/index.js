import { drizzle } from "drizzle-orm/node-postgres";
import  pg  from "pg";
import dotenv from "dotenv";
import findConfig from "find-config";

dotenv.config({path:findConfig('.env')});

const client = new pg.Client({
  connectionString: process.env.DB_STR,
});

await client.connect()
  .then(() => {console.log('database connected successfully')})
  .catch((ex) => (console.log('error while connecting to database:', ex)));
const db = drizzle(client);

export default db;