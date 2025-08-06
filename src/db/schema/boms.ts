import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";
import { relations } from "drizzle-orm";

export type BOM = typeof boms.$inferSelect;
export type NewBOM = typeof boms.$inferInsert

export const boms = pgTable('boms', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    componentName: text('component_name').notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 4 }).notNull(),
    unitOfMeasure: text('unit_of_measure').notNull().default('Piece'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the boms table if needed

export const bomsRelations = relations(boms, ({ one }) => ({
    product: one(products, {
        fields: [boms.productId],
        references: [products.id],
    }),
}));
