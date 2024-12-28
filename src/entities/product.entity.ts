import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column('int')
  price: number;

  @Column()
  description: string;

  @Column()
  stock: number;

  @Column()
  created_at: Date;
}
