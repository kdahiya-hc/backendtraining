// src/song/entities/song.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("varchar", { array: true })
  artists: string[];

  @Column({ type: "date" })
  releasedDate: Date;

  @Column()
  duration: string;
}