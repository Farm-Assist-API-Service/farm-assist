import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeFarmCategoryManyTomanyInProfileInformation1695226864659 implements MigrationInterface {
    name = 'MakeFarmCategoryManyTomanyInProfileInformation1695226864659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_informations_farm_categories" ("profile_information_id" integer NOT NULL, "farm_category_id" integer NOT NULL, CONSTRAINT "PK_c8ab30ae0158ab231a886879202" PRIMARY KEY ("profile_information_id", "farm_category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_312884065dddb1a2bb54701a77" ON "profile_informations_farm_categories" ("profile_information_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4af71b0db6f4b82c1ce8615c59" ON "profile_informations_farm_categories" ("farm_category_id") `);
        await queryRunner.query(`ALTER TABLE "profile_informations_farm_categories" ADD CONSTRAINT "FK_312884065dddb1a2bb54701a77b" FOREIGN KEY ("profile_information_id") REFERENCES "profile_informations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "profile_informations_farm_categories" ADD CONSTRAINT "FK_4af71b0db6f4b82c1ce8615c590" FOREIGN KEY ("farm_category_id") REFERENCES "farm_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations_farm_categories" DROP CONSTRAINT "FK_4af71b0db6f4b82c1ce8615c590"`);
        await queryRunner.query(`ALTER TABLE "profile_informations_farm_categories" DROP CONSTRAINT "FK_312884065dddb1a2bb54701a77b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4af71b0db6f4b82c1ce8615c59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_312884065dddb1a2bb54701a77"`);
        await queryRunner.query(`DROP TABLE "profile_informations_farm_categories"`);
    }

}
