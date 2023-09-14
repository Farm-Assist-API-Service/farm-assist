import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToFarmCategory1694677832977 implements MigrationInterface {
    name = 'AddIsActiveToFarmCategory1694677832977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm_categories" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm_categories" DROP COLUMN "is_active"`);
    }

}
