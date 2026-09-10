import { relations, sql } from 'drizzle-orm';
import {
    pgTable,
    text,
    timestamp,
    boolean,
    uuid,
    index,
    uniqueIndex,
    varchar,
    pgEnum,
    date,
    jsonb,
    check,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";





export const attendanceEnum = pgEnum("attendance_status", [
    "present",
    "absent",
    "half_day",
    "on_leave",
]);

export const attendance = pgTable(
    "attendance",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        employeeId: uuid("employee_id")
            .notNull()
            .references(() => employee.id),

        date: date("date").notNull(),

        checkIn: timestamp("check_in"),

        checkOut: timestamp("check_out"),

        status: attendanceEnum("status").notNull(),

        markedBy: uuid("marked_by")
            .references(() => employee.id),

        createdAt: timestamp("created_at")
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updated_at")
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex("attendance_employee_date_idx")
            .on(table.employeeId, table.date),
    ]
);



export const employeeStatusEnum = pgEnum("employee_status", [
  "active",
  "on_leave",
  "terminated",
]);

export const employee = pgTable(
  "employee",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => user.id),

    firstName: varchar("first_name", { length: 100 })
      .notNull(),

    lastName: varchar("last_name", { length: 100 })
      .notNull(),

    phone: varchar("phone", { length: 20 }),

    // HR / organization
    departmentId: uuid("department_id")
      .references(() => department.id),

    designation: varchar("designation", { length: 100 }),

    // Employee -> Employee
    managerId: uuid("manager_id")
      .references(() => employee.id),

    salaryBasic: numeric("salary_basic", {
      precision: 12,
      scale: 2,
    }),

    joiningDate: date("joining_date"),

    status: employeeStatusEnum("status")
      .notNull()
      .default("active"),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow(),
  }
);


export const department = pgTable("department", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull(),
    managerId: uuid("manager_id").references(() => employee.id),
    createdAt: timestamp("created_At").notNull().defaultNow()
})