import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { contacts } from "./contacts";
import { accounts } from "./accounts";
import { relations } from "drizzle-orm";

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'converted', 'lost']);


export const leads = pgTable('leads', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    jobTitle: text('job_title'),
    source: text('source'),
    status: leadStatusEnum('status').notNull().default('new'),
    score: integer('score').default(0),
    notes: text('notes'),
    ownerId: uuid('owner_id').references(() => users.id),
    convertedContactId: uuid('converted_contact_id').references(() => contacts.id),
    convertedAccountId: uuid('converted_account_id').references(() => accounts.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the leads table

export const leadsRelations = relations(leads, ({ one }) => ({
    owner: one(users, {
        fields: [leads.ownerId],
        references: [users.id],
    }),
    convertedContact: one(contacts, {
        fields: [leads.convertedContactId],
        references: [contacts.id],
    }),
    convertedAccount: one(accounts, {
        fields: [leads.convertedAccountId],
        references: [accounts.id],
    }),
}));
