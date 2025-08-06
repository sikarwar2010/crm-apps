import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;

export const attachments = pgTable('attachments', {
    id: uuid('id').defaultRandom().primaryKey(),
    fileName: text('file_name').notNull(),
    fileSize: integer('file_size').notNull(),
    fileType: text('file_type').notNull(),
    fileUrl: text('file_url').notNull(),
    uploadedById: uuid('uploaded_by_id').references(() => users.id),
    // Polymorphic relations
    relatedEntityType: text('related_entity_type').notNull(), // 'product', 'rfq', 'quote', 'account'
    relatedEntityId: uuid('related_entity_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations for the attachments table

export const attachmentsRelations = relations(attachments, ({ one }) => ({
    uploadedBy: one(users, {
        fields: [attachments.uploadedById],
        references: [users.id],
    }),
}));
