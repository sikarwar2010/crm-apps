import { relations } from "drizzle-orm";
import { boolean, decimal, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { boms } from "./boms";
import { quoteLineItems } from "./quotelineitems";
import { rfqLineItems } from "./rfqLineItems";

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    sku: text('sku').notNull().unique(),
    description: text('description'),
    category: text('category'),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }),
    unitOfMeasure: text('unit_of_measure').default('Piece'),
    bomRequired: boolean('bom_required').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    specifications: jsonb('specifications'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the products table if needed

export const productsRelations = relations(products, ({ many }) => ({
    bomItems: many(boms),
    quoteLineItems: many(quoteLineItems),
    rfqLineItems: many(rfqLineItems),
}));


