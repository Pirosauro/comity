CREATE TABLE "slug" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"source" varchar(255) NOT NULL,
	"target" varchar(255) NOT NULL,
	"redirect" integer DEFAULT 0 NOT NULL,
	"meta" json DEFAULT '{}'::json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slug" ADD CONSTRAINT "slug_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "slug_workspace_id_source_index" ON "slug" USING btree ("workspace_id","source");--> statement-breakpoint
CREATE INDEX "slug_target_index" ON "slug" USING btree ("target");