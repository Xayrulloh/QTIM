import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticlesAndUsers1747322688431 implements MigrationInterface {
  name = 'ArticlesAndUsers1747322688431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "article" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "publicationDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "authorId" integer,
                CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "article"
            ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"
        `);
    await queryRunner.query(`
            DROP TABLE "article"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
