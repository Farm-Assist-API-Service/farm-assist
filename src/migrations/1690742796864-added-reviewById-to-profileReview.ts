import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedReviewByIdToProfileReview1690742796864 implements MigrationInterface {
    name = 'AddedReviewByIdToProfileReview1690742796864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" ADD "review_by_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" DROP COLUMN "review_by_id"`);
    }

}
