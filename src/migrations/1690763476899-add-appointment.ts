import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointment1690763476899 implements MigrationInterface {
    name = 'AddAppointment1690763476899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('active', 'pending', 'cancelled', 'expired')`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_unit_of_time_enum" AS ENUM('mins', 'secs', 'hrs')`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_location_enum" AS ENUM('Zoom', 'Google meet', 'In-app')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "duration" integer NOT NULL DEFAULT '1', "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'active', "unit_of_time" "public"."appointments_unit_of_time_enum" NOT NULL DEFAULT 'mins', "location" "public"."appointments_location_enum" NOT NULL, "date" TIMESTAMP NOT NULL, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "host_id" integer, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_7758c2e5fcd3715535eeb31eb66" FOREIGN KEY ("host_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_7758c2e5fcd3715535eeb31eb66"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_location_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_unit_of_time_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
    }

}
