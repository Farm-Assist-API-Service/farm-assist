import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecipientNSenderIdToConversation1695151564242 implements MigrationInterface {
    name = 'AddRecipientNSenderIdToConversation1695151564242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" ADD "sender_id" integer`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "receiver_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "sender_id"`);
    }

}
