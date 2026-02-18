import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771357501141 implements MigrationInterface {
    name = 'Init1771357501141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('FIAT_COLLECTION', 'CRYPTO_COLLECTION')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "reference" character varying NOT NULL, "amount" numeric(12,2) NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'PENDING', "email" character varying, "token" character varying, "chain" character varying, "settledAmountInCrypto" numeric(18,8), "failureReason" character varying, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0b12a144bdc7678b6ddb0b913fc" UNIQUE ("reference"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
