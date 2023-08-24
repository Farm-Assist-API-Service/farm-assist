import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToProfileInformation1692771005500 implements MigrationInterface {
    name = 'AddNameToProfileInformation1692771005500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" DROP COLUMN "name"`);
    }

}
