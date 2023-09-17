import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetaDataToAppointments1694863552238 implements MigrationInterface {
    name = 'AddMetaDataToAppointments1694863552238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "meta_data" text`);
        await queryRunner.query(`ALTER TYPE "public"."appointments_location_enum" RENAME TO "appointments_location_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_location_enum" AS ENUM('Zoom', 'Google meet', 'Agora', 'In-app')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "location" TYPE "public"."appointments_location_enum" USING "location"::"text"::"public"."appointments_location_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_location_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointments_location_enum_old" AS ENUM('Zoom', 'Google meet', 'In-app')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "location" TYPE "public"."appointments_location_enum_old" USING "location"::"text"::"public"."appointments_location_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_location_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."appointments_location_enum_old" RENAME TO "appointments_location_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "meta_data"`);
    }

}
