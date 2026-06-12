import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminsTable } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";

const ADMIN_USERNAME = "fortharchitecture";
const ADMIN_PASSWORD = "Fortharcitecture@12";

async function ensureAdminCredentials() {
  const [existing] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, ADMIN_USERNAME))
    .limit(1);

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (!existing) {
    await db.insert(adminsTable).values({ username: ADMIN_USERNAME, passwordHash: hash });
    logger.info("Admin user created");
  } else {
    await db
      .update(adminsTable)
      .set({ passwordHash: hash })
      .where(eq(adminsTable.username, ADMIN_USERNAME));
    logger.info("Admin password synced");
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

ensureAdminCredentials()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to sync admin credentials");
    process.exit(1);
  });
