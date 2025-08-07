import { Exclude } from 'class-transformer';
import { Users } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => Users, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: Users;
}
