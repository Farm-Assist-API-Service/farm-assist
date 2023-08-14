import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegionIdToProfileInformation1691983270077 implements MigrationInterface {
    name = 'AddRegionIdToProfileInformation1691983270077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" ADD "region_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" DROP COLUMN "region_id"`);
    }

}
