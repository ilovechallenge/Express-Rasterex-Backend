import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomName1714410434875 implements MigrationInterface {
    name = 'AddRoomName1714410434875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "name"`);
    }

}
