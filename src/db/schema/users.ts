import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { leads } from "./leads";
import { deals } from "./deals";
import { quotes } from "./quotes";
import { rfqs } from "./rfqs";
import { tasks } from "./tasks";
import { emailLogs } from "./emailLogs";
import { attachments } from "./attachments";

export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'sales_rep', 'support']);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    clerkId: text('clerk_id').notNull().unique(),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    role: userRoleEnum('role').default('sales_rep'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the users table

export const usersRelations = relations(users, ({ many }) => ({
    ownedAccounts: many(accounts),
    ownedLeads: many(leads),
    ownedDeals: many(deals),
    ownedQuotes: many(quotes),
    ownedRfqs: many(rfqs),
    assignedTasks: many(tasks, { relationName: 'assignedTo' }),
    createdTasks: many(tasks, { relationName: 'createdBy' }),
    uploadedAttachments: many(attachments),
    sentEmails: many(emailLogs),
}));
