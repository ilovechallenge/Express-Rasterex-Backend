const { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} = require("typeorm");

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ nullable: false })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}