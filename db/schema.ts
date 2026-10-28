import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const leads = sqliteTable('leads', {
 id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull(), phone: text('phone').notNull(),
 consent: integer('consent').notNull(), consentText: text('consent_text').notNull(), createdAt: text('created_at').notNull(),
 status: text('status').notNull().default('pago_pendiente'), checkoutAt: text('checkout_at'), paidAt: text('paid_at'),
 transactionId: text('transaction_id'), amount: integer('amount').notNull().default(15000),
 utmSource: text('utm_source'), utmCampaign: text('utm_campaign')
});
