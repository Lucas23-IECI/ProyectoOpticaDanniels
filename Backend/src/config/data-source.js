import { DataSource } from "typeorm";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST || "database",
    port: 5432,
    username: process.env.DB_USERNAME || "admin",
    password: process.env.PASSWORD || "admin123",
    database: process.env.DATABASE || "optica_danniels",
    synchronize: true,
    logging: false,
    entities: [join(__dirname, "../entity/*.js")],
    migrations: [],
    subscribers: [],
});
