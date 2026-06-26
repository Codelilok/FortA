import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pinoHttp_ from "pino-http";
const pinoHttp = (pinoHttp_ as any).default ?? pinoHttp_;
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const PgSession = connectPgSimple(session);

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Record<string, any>) {
        return {
          id: req.id,
          method: req.method,
          url: typeof req.url === "string" ? req.url.split("?")[0] : req.url,
        };
      },
      res(res: Record<string, any>) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api", router);

const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

export default app;
