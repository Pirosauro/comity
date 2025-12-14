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
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(8) NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "chk_organization_status" CHECK (status IN ('active', 'inactive'))
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"code" varchar(8) NOT NULL,
	"name" varchar(64) NOT NULL,
	"type" varchar(32) NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "chk_tenant_status" CHECK (status IN ('active', 'inactive', 'suspended'))
);
--> statement-breakpoint
ALTER TABLE "slug" ADD CONSTRAINT "slug_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "slug_workspace_id_source_index" ON "slug" USING btree ("workspace_id","source");--> statement-breakpoint
CREATE INDEX "slug_target_index" ON "slug" USING btree ("target");--> statement-breakpoint
CREATE INDEX "idx_organization_tenant_id" ON "organizations" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uk_organization_tenant_code" ON "organizations" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "idx_organization_status" ON "organizations" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uk_workspace_organization_code" ON "workspaces" USING btree ("organization_id","code");--> statement-breakpoint
CREATE INDEX "idx_workspace_type" ON "workspaces" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_workspace_status" ON "workspaces" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tenant_status" ON "tenants" USING btree ("status");