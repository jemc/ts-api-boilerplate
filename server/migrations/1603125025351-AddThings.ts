import { MigrationInterface, QueryRunner } from "typeorm"

export class AddThings1603125025351 implements MigrationInterface {
  name = "AddThings1603125025351"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "thing" (
        "id" SERIAL NOT NULL,
        "color" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e7757c5911e20acd09faa22d1ac" PRIMARY KEY ("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "thing"
    `)
  }
}
