import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ unique: true })
  email: string;
}
