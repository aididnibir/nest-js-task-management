import {
  Column,
  Entity,
  Unique,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from 'src/tasks/task.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
@Unique(['userName'])
@Unique(['phoneNumber'])
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column({ length: 255 })
  email: string;

  @Exclude()
  @Column({ length: 50 })
  userName: string;

  @Exclude()
  @Column({ length: 50 })
  firstName: string;

  @Exclude()
  @Column({ length: 50 })
  lastName: string;

  @Exclude()
  @Column({ length: 1000 })
  password: string;

  @Exclude()
  @Column({ length: 15 })
  phoneNumber: string;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
