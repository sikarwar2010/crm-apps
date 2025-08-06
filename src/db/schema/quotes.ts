import { decimal, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { contacts } from "./contacts";
import { deals } from "./deals";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { quoteLineItems } from "./quotelineitems";
import { rfqs } from "./rfqs";

export const quoteStatusEnum = pgEnum('quote_status', ['draft', 'sent', 'approved', 'rejected', 'expired']);

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;

export const quotes = pgTable('quotes', {
    id: uuid('id').defaultRandom().primaryKey(),
    quoteNumber: text('quote_number').notNull().unique(),
    accountId: uuid('account_id').references(() => accounts.id).notNull(),
    contactId: uuid('contact_id').references(() => contacts.id),
    dealId: uuid('deal_id').references(() => deals.id),
    version: integer('version').notNull().default(1),
    status: quoteStatusEnum('status').notNull().default('draft'),
    validUntil: timestamp('valid_until'),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
    taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }).default('0'),
    grandTotal: decimal('grand_total', { precision: 15, scale: 2 }).notNull(),
    terms: text('terms'),
    notes: text('notes'),
    ownerId: uuid('owner_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the quotes table

export const quotesRelations = relations(quotes, ({ one, many }) => ({
    account: one(accounts, {
        fields: [quotes.accountId],
        references: [accounts.id],
    }),
    contact: one(contacts, {
        fields: [quotes.contactId],
        references: [contacts.id],
    }),
    deal: one(deals, {
        fields: [quotes.dealId],
        references: [deals.id],
    }),
    owner: one(users, {
        fields: [quotes.ownerId],
        references: [users.id],
    }),
    lineItems: many(quoteLineItems),
    rfqs: many(rfqs),
}));
