import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db from './index.js';

async function migrateData(){
    await migrate(db, { migrationsFolder: "./drizzle"});
    process.exit(0);
}
migrateData().catch((ex) => {
    console.log(ex);
    process.exit(0);
})