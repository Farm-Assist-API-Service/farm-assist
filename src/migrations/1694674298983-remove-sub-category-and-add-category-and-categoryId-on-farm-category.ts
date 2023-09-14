import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSubCategoryAndAddCategoryAndCategoryIdOnFarmCategory1694674298983 implements MigrationInterface {
    name = 'RemoveSubCategoryAndAddCategoryAndCategoryIdOnFarmCategory1694674298983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm_categories" ADD "category_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm_categories" DROP COLUMN "category_id"`);
    }

}
