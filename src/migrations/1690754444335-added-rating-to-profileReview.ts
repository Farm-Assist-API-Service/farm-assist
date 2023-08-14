import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRatingToProfileReview1690754444335 implements MigrationInterface {
    name = 'AddedRatingToProfileReview1690754444335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" ADD "rating" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" DROP COLUMN "rating"`);
    }

}
