import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordHistory1695711771609 implements MigrationInterface {
    name = 'CreatePasswordHistory1695711771609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_histories" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "valid" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "user_id" integer, CONSTRAINT "PK_3b3ab30d6152c933113c9534442" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password_histories" ADD CONSTRAINT "FK_c249db3c7834f0a3e7cdb922347" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_histories" DROP CONSTRAINT "FK_c249db3c7834f0a3e7cdb922347"`);
        await queryRunner.query(`DROP TABLE "password_histories"`);
    }

}
