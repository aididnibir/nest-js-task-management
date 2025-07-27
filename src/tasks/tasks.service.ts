import { v7 as createUniqueId } from 'uuid';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create.task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '123',
      status: TaskStatus.OPEN,
      title: 'Sample new task1',
      description: 'New task sample description 1!',
    },
    {
      id: '456',
      status: TaskStatus.OPEN,
      title: 'Sample new task2',
      description: 'New task sample description 2!',
    },
    {
      id: '789',
      status: TaskStatus.OPEN,
      title: 'Sample new task3',
      description: 'New task sample description 3!',
    },
  ];

  getAllTasks() {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    if (status || search) {
      const filteredTasks = this.tasks.filter(
        (task) =>
          (status ? task.status === status : true) &&
          (search
            ? task.title.includes(search) || task.description.includes(search)
            : true),
      );
      if (filteredTasks.length > 0) {
        return filteredTasks;
      } else {
        throw new NotFoundException(`No task found with the applied filters`);
      }
    }
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const newTask: Task = {
      title,
      description,
      id: createUniqueId(),
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  getTaskById(taskId: string): Task {
    const filteredTask = this.tasks.find((task) => taskId === task.id);
    if (filteredTask) {
      return filteredTask;
    } else {
      throw new NotFoundException(`No task found with id: ${taskId}`);
    }
  }

  deleteTaskById(taskId: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      return `Successfully Deleted task with id ${taskId}`;
    } else {
      throw new NotFoundException(`No task found with id: ${taskId}`);
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskStatusToUpdate = this.getTaskById(id);
    taskStatusToUpdate.status = status;
    return taskStatusToUpdate;
  }
}
