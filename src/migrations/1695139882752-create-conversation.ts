import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConversation1695139882752 implements MigrationInterface {
    name = 'CreateConversation1695139882752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."conversations_type_enum" AS ENUM('peer', 'group')`);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "type" "public"."conversations_type_enum" NOT NULL DEFAULT 'peer', "chats" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP TYPE "public"."conversations_type_enum"`);
    }

}
