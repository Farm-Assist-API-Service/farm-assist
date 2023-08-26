import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancellationAppointment1693062247624 implements MigrationInterface {
    name = 'AddCancellationAppointment1693062247624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "cancellation" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "cancellation"`);
    }

}
