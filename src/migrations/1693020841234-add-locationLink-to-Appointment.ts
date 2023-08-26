import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationLinkToAppointment1693020841234 implements MigrationInterface {
    name = 'AddLocationLinkToAppointment1693020841234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "location_link" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "location_link"`);
    }

}
