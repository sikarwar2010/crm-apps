import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { relations } from "drizzle-orm";
import { leads } from "./leads";
import { deals } from "./deals";
import { quotes } from "./quotes";
import { rfqs } from "./rfqs";

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export const contacts = pgTable('contacts', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email'),
    phone: text('phone'),
    jobTitle: text('job_title'),
    department: text('department'),
    accountId: uuid('account_id').references(() => accounts.id),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the contacts table

export const contactsRelations = relations(contacts, ({ one, many }) => ({
    account: one(accounts, {
        fields: [contacts.accountId],
        references: [accounts.id],
    }),
    convertedFromLead: one(leads),
    deals: many(deals),
    quotes: many(quotes),
    rfqs: many(rfqs),
}));
