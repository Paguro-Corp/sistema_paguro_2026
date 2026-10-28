CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`consent` integer NOT NULL,
	`consent_text` text NOT NULL,
	`created_at` text NOT NULL,
	`status` text DEFAULT 'pago_pendiente' NOT NULL,
	`checkout_at` text,
	`paid_at` text,
	`transaction_id` text,
	`amount` integer DEFAULT 15000 NOT NULL,
	`utm_source` text,
	`utm_campaign` text
);
