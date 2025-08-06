import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export type EmailLog = typeof emailLogs.$inferSelect;
export type NewEmailLog = typeof emailLogs.$inferInsert;

export const emailLogs = pgTable('email_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    to: text('to').notNull(),
    cc: text('cc'),
    bcc: text('bcc'),
    subject: text('subject').notNull(),
    body: text('body').notNull(),
    sentAt: timestamp('sent_at').defaultNow().notNull(),
    sentById: uuid('sent_by_id').references(() => users.id),
    // Polymorphic relations
    relatedEntityType: text('related_entity_type'), // 'rfq', 'quote', 'lead'
    relatedEntityId: uuid('related_entity_id'),
});

// Define relations for the emailLogs table

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
    sentBy: one(users, {
        fields: [emailLogs.sentById],
        references: [users.id],
    }),
}));
