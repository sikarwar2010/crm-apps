import { decimal, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { contacts } from "./contacts";
import { leads } from "./leads";
import { deals } from "./deals";
import { quotes } from "./quotes";
import { rfqs } from "./rfqs";

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export const accounts = pgTable('accounts', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    website: text('website'),
    phone: text('phone'),
    email: text('email'),
    industry: text('industry'),
    address: jsonb('address').$type<{
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }>(),
    annualRevenue: decimal('annual_revenue'),
    employeeCount: integer('employee_count'),
    description: text('description'),
    ownerId: uuid('owner_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the accounts table

export const accountsRelations = relations(accounts, ({ one, many }) => ({
    owner: one(users, {
        fields: [accounts.ownerId],
        references: [users.id],
    }),
    contacts: many(contacts),
    leads: many(leads),
    deals: many(deals),
    quotes: many(quotes),
    rfqs: many(rfqs),
}));
