import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayoutTypes1771358499864 implements MigrationInterface {
    name = 'AddPayoutTypes1771358499864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('FIAT_COLLECTION', 'CRYPTO_COLLECTION', 'FIAT_PAYOUT', 'CRYPTO_PAYOUT')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('FIAT_COLLECTION', 'CRYPTO_COLLECTION')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum_old" USING "type"::"text"::"public"."transaction_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_type_enum_old" RENAME TO "transaction_type_enum"`);
    }

}
