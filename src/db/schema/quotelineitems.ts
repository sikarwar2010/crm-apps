import { decimal, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { quotes } from "./quotes";
import { products } from "./products";
import { relations } from "drizzle-orm";

export type QuoteLineItem = typeof quoteLineItems.$inferSelect;
export type NewQuoteLineItem = typeof quoteLineItems.$inferInsert;

export const quoteLineItems = pgTable('quote_line_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    quoteId: uuid('quote_id').references(() => quotes.id).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 4 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    discount: decimal('discount', { precision: 5, scale: 2 }).default('0'),
    lineTotal: decimal('line_total', { precision: 15, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations for the quoteLineItems table

export const quoteLineItemsRelations = relations(quoteLineItems, ({ one }) => ({
    quote: one(quotes, {
        fields: [quoteLineItems.quoteId],
        references: [quotes.id],
    }),
    product: one(products, {
        fields: [quoteLineItems.productId],
        references: [products.id],
    }),
}));
