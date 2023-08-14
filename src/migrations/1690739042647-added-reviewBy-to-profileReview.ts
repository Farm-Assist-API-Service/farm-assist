import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedReviewByToProfileReview1690739042647 implements MigrationInterface {
    name = 'AddedReviewByToProfileReview1690739042647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" DROP CONSTRAINT "FK_9db4f7a48824a10e755a722344d"`);
        await queryRunner.query(`ALTER TABLE "profile_reviews" DROP COLUMN "reviewers_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" ADD "reviewers_id" integer`);
        await queryRunner.query(`ALTER TABLE "profile_reviews" ADD CONSTRAINT "FK_9db4f7a48824a10e755a722344d" FOREIGN KEY ("reviewers_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
