import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async getTaskWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
    };
    await this.tasksRepository.save(newTask);

    return newTask;
  }

  async getTaskById(id: string): Promise<Task> {
    const resultantTask = await this.tasksRepository.findOne({ where: { id } });
    if (resultantTask) {
      return resultantTask;
    } else {
      throw new NotFoundException(`No task found with id: ${id}`);
    }
  }

  async deleteTaskById(taskId: string): Promise<string> {
    const result = await this.tasksRepository.delete(taskId);
    if (result.affected && result.affected > 0) {
      return `Successfully Deleted task with id ${taskId}`;
    } else {
      throw new NotFoundException(`No task found with id: ${taskId}`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const taskStatusToUpdate = await this.getTaskById(id);

    taskStatusToUpdate.status = status;
    await this.tasksRepository.save(taskStatusToUpdate);

    return taskStatusToUpdate;
  }
}
