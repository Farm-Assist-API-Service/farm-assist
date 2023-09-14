import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFarmCategoryTable1694626562106 implements MigrationInterface {
    name = 'CreateFarmCategoryTable1694626562106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "farm_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, CONSTRAINT "PK_108157056c9c79e0c5f1747d40c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "farm_categories"`);
    }

}
