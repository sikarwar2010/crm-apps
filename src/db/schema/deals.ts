import { decimal, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { contacts } from "./contacts";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { quotes } from "./quotes";
import { rfqs } from "./rfqs";

export const dealStatusEnum = pgEnum('deal_status', ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']);

export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;

export const deals = pgTable('deals', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    accountId: uuid('account_id').references(() => accounts.id).notNull(),
    contactId: uuid('contact_id').references(() => contacts.id),
    amount: decimal('amount', { precision: 15, scale: 2 }),
    probability: integer('probability').default(0),
    status: dealStatusEnum('status').notNull().default('prospecting'),
    expectedCloseDate: timestamp('expected_close_date'),
    actualCloseDate: timestamp('actual_close_date'),
    description: text('description'),
    ownerId: uuid('owner_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


// Define relations for the deals table

export const dealsRelations = relations(deals, ({ one, many }) => ({
    account: one(accounts, {
        fields: [deals.accountId],
        references: [accounts.id],
    }),
    contact: one(contacts, {
        fields: [deals.contactId],
        references: [contacts.id],
    }),
    owner: one(users, {
        fields: [deals.ownerId],
        references: [users.id],
    }),
    quotes: many(quotes),
    rfqs: many(rfqs),
}));
