import {
  Get,
  Body,
  Post,
  Query,
  Patch,
  Param,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';

import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/auth/user.entity';
import { TasksService } from './tasks.service';
import { getUser } from 'src/auth/get-user.decorator';
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update.task.status.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @getUser() user: Users,
  ): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTaskWithFilters(filterDto, user);
    } else {
      return this.taskService.getAllTasks(user);
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @getUser() user: Users): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post('/create')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @getUser() user: Users,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @getUser() user: Users,
    @Param('id') id: string,
  ): Promise<string> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id')
  updateTaskStatus(
    @getUser() user: Users,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
