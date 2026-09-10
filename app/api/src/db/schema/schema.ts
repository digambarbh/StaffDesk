
import {
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  unique,
  varchar,
  pgEnum,
  date,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const attendanceEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "half_day",
  "on_leave",
]);

export const roleEnum = pgEnum("role", ["admin", "manager", "employee"]);

export const employeeStatusEnum = pgEnum("employee_status", [
  "active",
  "on_leave",
  "terminated",
]);

export const leaveTypeEnum = pgEnum("leave_type", ["sick", "casual", "paid", "unpaid"]);
export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "rejected"]);


export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("employee"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;


export const employee = pgTable("employee", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => user.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  departmentId: uuid("department_id").references(() => department.id),
  designation: varchar("designation", { length: 100 }),
  managerId: uuid("manager_id").references(() => employee.id),
  salaryBasic: numeric("salary_basic", { precision: 12, scale: 2 }),
  joiningDate: date("joining_date"),
  status: employeeStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Employee = InferSelectModel<typeof employee>;
export type NewEmployee = InferInsertModel<typeof employee>;


export const department = pgTable("department", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  managerId: uuid("manager_id").references(() => employee.id),
  createdAt: timestamp("created_at").notNull().defaultNow(), 
});

export type Department = InferSelectModel<typeof department>;
export type NewDepartment = InferInsertModel<typeof department>;


export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id").notNull().references(() => employee.id),
    date: date("date").notNull(),
    checkIn: timestamp("check_in"),
    checkOut: timestamp("check_out"),
    status: attendanceEnum("status").notNull(),
    markedBy: uuid("marked_by").references(() => employee.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    attendanceEmployeeDateIdx: uniqueIndex("attendance_employee_date_idx")
      .on(table.employeeId, table.date),
  })
);

export type Attendance = InferSelectModel<typeof attendance>;
export type NewAttendance = InferInsertModel<typeof attendance>;


export const leave = pgTable("leave", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").notNull().references(() => employee.id),
  type: leaveTypeEnum("type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").notNull().default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => employee.id),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Leave = InferSelectModel<typeof leave>;
export type NewLeave = InferInsertModel<typeof leave>;


export const leaveBalance = pgTable(
  "leave_balance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id").notNull().references(() => employee.id),
    sickDaysLeft: integer("sick_days_left").notNull().default(0),
    casualDaysLeft: integer("casual_days_left").notNull().default(0),
    paidDaysLeft: integer("paid_days_left").notNull().default(0),
    year: integer("year").notNull(),
  },
  (t) => ({
    oneBalancePerEmployeePerYear: unique().on(t.employeeId, t.year),
  })
);

export type LeaveBalance = InferSelectModel<typeof leaveBalance>;
export type NewLeaveBalance = InferInsertModel<typeof leaveBalance>;


export const salary = pgTable(
  "salary",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id").notNull().references(() => employee.id),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    basic: numeric("basic", { precision: 10, scale: 2 }).notNull(),
    allowances: numeric("allowances", { precision: 10, scale: 2 }).notNull().default("0"),
    deductions: numeric("deductions", { precision: 10, scale: 2 }).notNull().default("0"),
    netPay: numeric("net_pay", { precision: 10, scale: 2 }).notNull(),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
  },
  (t) => ({
    oneSlipPerMonth: unique().on(t.employeeId, t.month, t.year),
  })
);

export type Salary = InferSelectModel<typeof salary>;
export type NewSalary = InferInsertModel<typeof salary>;