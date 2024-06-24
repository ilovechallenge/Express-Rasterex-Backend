import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({ name: "rooms" })
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    creator: string

    @Column({ nullable: false })
    creator_socket: string

    @Column({ nullable: false })
    file: string

    @Column({ nullable: false })
    status: boolean

    @Column("text", { array: true })
    users: string[]

    @Column("text", { array: true })
    users_socket: string[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}