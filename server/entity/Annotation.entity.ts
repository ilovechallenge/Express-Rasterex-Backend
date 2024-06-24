const { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} = require("typeorm");

const { Room } = require('./Room.entity')

@Entity({ name: "annotations" })
export class Annotation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "json" })
    comment: any;

    @Column({ nullable: false })
    user: string;

    @ManyToOne(() => Room)
    room: typeof Room;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}