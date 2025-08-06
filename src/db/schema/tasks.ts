import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'cancelled']);


export const taskTypeEnum = pgEnum('task_type', ['call', 'meeting', 'email', 'follow_up', 'demo']);

export type Task = typeof tasks.$inferSelect;

export type NewTask = typeof tasks.$inferInsert;


export const tasks = pgTable('tasks', {
    id: uuid('id').defaultRandom().primaryKey(),
    subject: text('subject').notNull(),
    description: text('description'),
    type: taskTypeEnum('type').notNull(),
    status: taskStatusEnum('status').notNull().default('pending'),
    priority: text('priority').default('medium'),
    dueDate: timestamp('due_date'),
    completedAt: timestamp('completed_at'),
    assignedToId: uuid('assigned_to_id').references(() => users.id),
    createdById: uuid('created_by_id').references(() => users.id),
    // Polymorphic relations
    relatedEntityType: text('related_entity_type'), // 'lead', 'contact', 'account', 'deal', 'quote', 'rfq'
    relatedEntityId: uuid('related_entity_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for the tasks table

export const tasksRelations = relations(tasks, ({ one }) => ({
    assignedTo: one(users, {
        fields: [tasks.assignedToId],
        references: [users.id],
        relationName: 'assignedTo',
    }),
    createdBy: one(users, {
        fields: [tasks.createdById],
        references: [users.id],
        relationName: 'createdBy',
    }),
}));
