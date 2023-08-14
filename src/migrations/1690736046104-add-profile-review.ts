import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileReview1690736046104 implements MigrationInterface {
    name = 'AddProfileReview1690736046104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile_reviews" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "reviewers_id" integer, "profile_id" integer, CONSTRAINT "PK_ad6266a43d0af8e68d5c62e68fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile_reviews" ADD CONSTRAINT "FK_9db4f7a48824a10e755a722344d" FOREIGN KEY ("reviewers_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_reviews" ADD CONSTRAINT "FK_13ae30172b24cd54c116fb387db" FOREIGN KEY ("profile_id") REFERENCES "profile_informations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_reviews" DROP CONSTRAINT "FK_13ae30172b24cd54c116fb387db"`);
        await queryRunner.query(`ALTER TABLE "profile_reviews" DROP CONSTRAINT "FK_9db4f7a48824a10e755a722344d"`);
        await queryRunner.query(`DROP TABLE "profile_reviews"`);
    }

}
