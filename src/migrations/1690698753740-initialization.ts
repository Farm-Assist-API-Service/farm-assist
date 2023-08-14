import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1690698753740 implements MigrationInterface {
    name = 'Initialization1690698753740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invites_status_enum" AS ENUM('PENDING', 'USED')`);
        await queryRunner.query(`CREATE TABLE "invites" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "status" "public"."invites_status_enum" NOT NULL DEFAULT 'PENDING', "is_universal" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer, CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "symbol" character varying, "is_default" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."regions_payment_provider_enum" AS ENUM('Paystack')`);
        await queryRunner.query(`CREATE TYPE "public"."regions_wallet_provider_enum" AS ENUM('VFD')`);
        await queryRunner.query(`CREATE TABLE "regions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "payment_provider" "public"."regions_payment_provider_enum" NOT NULL DEFAULT 'Paystack', "wallet_provider" "public"."regions_wallet_provider_enum" NOT NULL DEFAULT 'VFD', "flag_svg" character varying, "flag_png" character varying, "is_active" boolean NOT NULL DEFAULT true, "is_default" boolean DEFAULT false, "code" character varying, "new_card_charge_amount" integer DEFAULT '50', "demonym" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "currency_id" integer, CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile_informations" ("id" SERIAL NOT NULL, "phone" character varying, "ownership_type" character varying NOT NULL DEFAULT 'regular', "fcm_token" character varying, "device_id" character varying, "auth_biometric_public_key" character varying, "home_address" character varying, "state" character varying, "work_address" character varying, "is_completed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "user_id" integer, CONSTRAINT "PK_a8a5035d4732ab211f473cb5942" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9afaa1194b47640acebab6318f" ON "profile_informations" ("is_completed") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Admin', 'User')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "phone" character varying, "email" character varying NOT NULL, "email_alias" character varying, "password" character varying NOT NULL, "otp" character varying, "otp_verified" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL DEFAULT 'User', "source" character varying NOT NULL DEFAULT 'Development env', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "invite_id" integer, "region_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_5e2a07492128e96a16b3fdcf9a0" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regions" ADD CONSTRAINT "FK_223dce276e8df22d6608430d707" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_informations" ADD CONSTRAINT "FK_6b8e03fa74059032da4925d7ddb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b7f0fb0b526e92856c707c8b882" FOREIGN KEY ("invite_id") REFERENCES "invites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1901e9aae03c8897b7dd460c27f" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1901e9aae03c8897b7dd460c27f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b7f0fb0b526e92856c707c8b882"`);
        await queryRunner.query(`ALTER TABLE "profile_informations" DROP CONSTRAINT "FK_6b8e03fa74059032da4925d7ddb"`);
        await queryRunner.query(`ALTER TABLE "regions" DROP CONSTRAINT "FK_223dce276e8df22d6608430d707"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_5e2a07492128e96a16b3fdcf9a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9afaa1194b47640acebab6318f"`);
        await queryRunner.query(`DROP TABLE "profile_informations"`);
        await queryRunner.query(`DROP TABLE "regions"`);
        await queryRunner.query(`DROP TYPE "public"."regions_wallet_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."regions_payment_provider_enum"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "invites"`);
        await queryRunner.query(`DROP TYPE "public"."invites_status_enum"`);
    }

}
