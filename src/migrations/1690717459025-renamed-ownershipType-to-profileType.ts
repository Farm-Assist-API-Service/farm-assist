import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamedOwnershipTypeToProfileType1690717459025 implements MigrationInterface {
    name = 'RenamedOwnershipTypeToProfileType1690717459025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" RENAME COLUMN "ownership_type" TO "profile_type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_informations" RENAME COLUMN "profile_type" TO "ownership_type"`);
    }

}
