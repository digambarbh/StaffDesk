import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
    store: new PgSession({
        conString: process.env.DATABASE_URI,
        tableName: "session",
        createTableIfMissing: true,
    }),

    secret: process.env.SESSION_SECRET!,

    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE === "true",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 2,
    },
});