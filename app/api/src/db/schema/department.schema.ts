import { PgTable,uuid,varchar,text,PgTimestamp, pgTable } from "drizzle-orm/pg-core";

import type { InferSelectModel , InferInsertModel } from "drizzle-orm";
import { timestamp } from "drizzle-orm/gel-core";

export const department=pgTable("department",{
    id:uuid("id").primaryKey().defaultRandom(),
    nameP:varchar("name",{length:50}).notNull(),
    managerId:uuid("manager_id").references(()=>employee.id), //
    createdAt:timestamp("created_At").notNull().defaultNow()
})