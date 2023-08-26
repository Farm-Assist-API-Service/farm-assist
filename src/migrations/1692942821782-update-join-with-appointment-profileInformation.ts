import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJoinWithAppointmentProfileInformation1692942821782 implements MigrationInterface {
    name = 'UpdateJoinWithAppointmentProfileInformation1692942821782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointments_profile_informations" ("appointment_id" integer NOT NULL, "profile_information_id" integer NOT NULL, CONSTRAINT "PK_1f9b5104f58fc2cf237083b667f" PRIMARY KEY ("appointment_id", "profile_information_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_909c8a4481a761b13ddc4222e5" ON "appointments_profile_informations" ("appointment_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a9f712c21ac423726d0f21b6c" ON "appointments_profile_informations" ("profile_information_id") `);
        await queryRunner.query(`ALTER TABLE "appointments_profile_informations" ADD CONSTRAINT "FK_909c8a4481a761b13ddc4222e5b" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "appointments_profile_informations" ADD CONSTRAINT "FK_2a9f712c21ac423726d0f21b6cf" FOREIGN KEY ("profile_information_id") REFERENCES "profile_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments_profile_informations" DROP CONSTRAINT "FK_2a9f712c21ac423726d0f21b6cf"`);
        await queryRunner.query(`ALTER TABLE "appointments_profile_informations" DROP CONSTRAINT "FK_909c8a4481a761b13ddc4222e5b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a9f712c21ac423726d0f21b6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_909c8a4481a761b13ddc4222e5"`);
        await queryRunner.query(`DROP TABLE "appointments_profile_informations"`);
    }

}
