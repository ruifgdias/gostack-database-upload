import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export default class AddConstraintTransactionCategory1602252315223 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            name: 'TransactionsCategoryForeignKey',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('transactions', 'TransactionsCategoryForeignKey');
    }

}
