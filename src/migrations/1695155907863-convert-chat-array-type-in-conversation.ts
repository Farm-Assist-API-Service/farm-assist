import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertChatArrayTypeInConversation1695155907863 implements MigrationInterface {
    name = 'ConvertChatArrayTypeInConversation1695155907863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "chats"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "chats" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "chats"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "chats" text`);
    }

}
