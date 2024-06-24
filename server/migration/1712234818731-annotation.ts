import { MigrationInterface, QueryRunner } from "typeorm";

export class Annotation1712234818731 implements MigrationInterface {
    name = 'Annotation1712234818731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "annotations" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "annotations" ADD "comment" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "annotations" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "annotations" ADD "comment" character varying NOT NULL`);
    }

}
