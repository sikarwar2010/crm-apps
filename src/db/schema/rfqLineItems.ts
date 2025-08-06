import { decimal, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { rfqs } from "./rfqs";
import { products } from "./products";
import { relations } from "drizzle-orm";

export type RFQLineItem = typeof rfqLineItems.$inferSelect;
export type NewRFQLineItem = typeof rfqLineItems.$inferInsert;

export const rfqLineItems = pgTable('rfq_line_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    rfqId: uuid('rfq_id').references(() => rfqs.id).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 4 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    lineTotal: decimal('line_total', { precision: 15, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


// Define relations for the rfqLineItems table

export const rfqLineItemsRelations = relations(rfqLineItems, ({ one }) => ({
    rfq: one(rfqs, {
        fields: [rfqLineItems.rfqId],
        references: [rfqs.id],
    }),
    product: one(products, {
        fields: [rfqLineItems.productId],
        references: [products.id],
    }),
}));
