import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStatusToProfileInformation1690763881527 implements MigrationInterface {
    name = 'AddedStatusToProfileInformation1690763881527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."profile_informations_status_enum" AS ENUM('active', 'deactivated', 'suspended')`);
        await queryRunner.query(`ALTER TABLE "profile_informations" ADD "status" "public"."profile_informations_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."profile_informations_status_enum"`);
    }

}
