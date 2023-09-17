import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEUnitOfTime1694836070023 implements MigrationInterface {
    name = 'UpdateEUnitOfTime1694836070023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."appointments_unit_of_time_enum" RENAME TO "appointments_unit_of_time_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_unit_of_time_enum" AS ENUM('minutes', 'seconds', 'hours')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "unit_of_time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "unit_of_time" TYPE "public"."appointments_unit_of_time_enum" USING "unit_of_time"::"text"::"public"."appointments_unit_of_time_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "unit_of_time" SET DEFAULT 'minutes'`);
        await queryRunner.query(`DROP TYPE "public"."appointments_unit_of_time_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointments_unit_of_time_enum_old" AS ENUM('mins', 'secs', 'hrs')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "unit_of_time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "unit_of_time" TYPE "public"."appointments_unit_of_time_enum_old" USING "unit_of_time"::"text"::"public"."appointments_unit_of_time_enum_old"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "unit_of_time" SET DEFAULT 'mins'`);
        await queryRunner.query(`DROP TYPE "public"."appointments_unit_of_time_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."appointments_unit_of_time_enum_old" RENAME TO "appointments_unit_of_time_enum"`);
    }

}
