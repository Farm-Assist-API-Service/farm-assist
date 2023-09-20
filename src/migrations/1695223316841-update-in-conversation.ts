import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInConversation1695223316841 implements MigrationInterface {
    name = 'UpdateInConversation1695223316841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "receiver_id" TO "recipient_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_e3c404a3d131a6e14028623bb76" FOREIGN KEY ("sender_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_69751ccb15197d1ca4827374f9f" FOREIGN KEY ("recipient_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_69751ccb15197d1ca4827374f9f"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_e3c404a3d131a6e14028623bb76"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "recipient_id" TO "receiver_id"`);
    }

}
