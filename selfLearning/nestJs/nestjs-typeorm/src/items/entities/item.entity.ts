import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Listing } from './listing.entity';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: true })
  public: boolean;

  @OneToOne(() => Listing, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  listing: Listing;

  @OneToMany(() => Comment, (comment) => comment.item, { cascade: true })
  comment: Comment[];

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tag: Tag[];
}
