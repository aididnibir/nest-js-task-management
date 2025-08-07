import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Users } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create.task.dto';
import { instanceToInstance } from 'class-transformer';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(user: Users): Promise<Task[]> {
    return await this.tasksRepository.find({ where: { user } });
  }

  async getTaskWithFilters(
    filterDto: GetTasksFilterDto,
    user: Users,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user }); // either this

    // or this
    // if (status) {
    //   query.andWhere('task.status = :status and task.user = :user', {
    //     status,
    //     user,
    //   });
    // }

    if (status) {
      query.andWhere('task.status = :status', {
        status,
      });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    if (tasks.length > 0) {
      return tasks;
    } else {
      throw new NotFoundException(`No task found with the applied filters`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask: Task = {
      user,
      title,
      description,
      status: TaskStatus.OPEN,
    };
    await this.tasksRepository.save(newTask);

    return instanceToInstance(newTask);
  }

  async getTaskById(id: string, user: Users): Promise<Task> {
    const resultantTask = await this.tasksRepository.findOne({
      where: { id, user },
    });
    if (resultantTask) {
      return resultantTask;
    } else {
      throw new NotFoundException(`No task found with id: ${id}`);
    }
  }

  async deleteTaskById(id: string, user: Users): Promise<string> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected && result.affected > 0) {
      return `Successfully Deleted task with id ${id}`;
    } else {
      throw new NotFoundException(`No task found with id: ${id}`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: Users,
  ): Promise<Task> {
    const taskStatusToUpdate = await this.getTaskById(id, user);

    taskStatusToUpdate.status = status;
    await this.tasksRepository.save(taskStatusToUpdate);

    return taskStatusToUpdate;
  }
}
