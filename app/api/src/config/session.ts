import session from "express-session"

import connectPgSimple from "connect-pg-simple"

const PgSession=connectPgSimple(session);


export const sessionMiddleware=session({
    store: new PgSession({
        conString: process.env.DATABASE_URI
        ,
    }),
    secret: ""
})