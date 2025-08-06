import { boolean, decimal, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { contacts } from "./contacts";
import { deals } from "./deals";
import { quotes } from "./quotes";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { rfqLineItems } from "./rfqLineItems";

export const rfqStatusEnum = pgEnum('rfq_status', ['draft', 'sent', 'revised', 'approved', 'rejected']);

export type RFQ = typeof rfqs.$inferSelect;
export type NewRFQ = typeof rfqs.$inferInsert;

export const rfqs = pgTable('rfqs', {
    id: uuid('id').defaultRandom().primaryKey(),
    rfqNumber: text('rfq_number').notNull().unique(),
    accountId: uuid('account_id').references(() => accounts.id).notNull(),
    contactId: uuid('contact_id').references(() => contacts.id),
    dealId: uuid('deal_id').references(() => deals.id),
    quoteId: uuid('quote_id').references(() => quotes.id),
    version: integer('version').notNull().default(1),
    status: rfqStatusEnum('status').notNull().default('draft'),
    validUntil: timestamp('valid_until'),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
    taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }).default('0'),
    grandTotal: decimal('grand_total', { precision: 15, scale: 2 }).notNull(),
    emailSent: boolean('email_sent').notNull().default(false),
    emailSentAt: timestamp('email_sent_at'),
    notes: text('notes'),
    ownerId: uuid('owner_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the rfqs table

export const rfqsRelations = relations(rfqs, ({ one, many }) => ({
    account: one(accounts, {
        fields: [rfqs.accountId],
        references: [accounts.id],
    }),
    contact: one(contacts, {
        fields: [rfqs.contactId],
        references: [contacts.id],
    }),
    deal: one(deals, {
        fields: [rfqs.dealId],
        references: [deals.id],
    }),
    quote: one(quotes, {
        fields: [rfqs.quoteId],
        references: [quotes.id],
    }),
    owner: one(users, {
        fields: [rfqs.ownerId],
        references: [users.id],
    }),
    lineItems: many(rfqLineItems),
}));
