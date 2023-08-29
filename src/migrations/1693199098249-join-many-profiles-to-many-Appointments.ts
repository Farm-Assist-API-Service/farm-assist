import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinManyProfilesToManyAppointments1693199098249 implements MigrationInterface {
    name = 'JoinManyProfilesToManyAppointments1693199098249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_7758c2e5fcd3715535eeb31eb66"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "host_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "host_id" integer`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_7758c2e5fcd3715535eeb31eb66" FOREIGN KEY ("host_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
