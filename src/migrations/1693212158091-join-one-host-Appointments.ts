import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinOneHostAppointments1693212158091 implements MigrationInterface {
    name = 'JoinOneHostAppointments1693212158091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "host_id" integer`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_7758c2e5fcd3715535eeb31eb66" FOREIGN KEY ("host_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_7758c2e5fcd3715535eeb31eb66"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "host_id"`);
    }

}
