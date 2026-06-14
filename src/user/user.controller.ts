import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { Response } from 'express';
import { roleType } from '../../generated/prisma/enums.js';
// import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
// import { Roles } from 'src/auth/Decorator/role.decorator';

// import { ApiBearerAuth } from '@nestjs/swagger';

//@UseGuards(RoleGuard)
// @ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.userService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: result,
      message: ' User Created ',
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('role') role?: roleType,
    @Query('limit') limit: Number = 10,
    @Query('page') page: Number = 1,
  ) {
    const result = await this.userService.findAll(role, +limit, +page);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ' Users Found ',
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ` User ${id} Founded `,
      status: HttpStatus.OK,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.update(+id, updateUserDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ` User ${id} Updated `,
      status: HttpStatus.OK,
    });
  }

  // @Roles(roleType.admin, roleType.moderator)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.remove(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: '',
      message: ` User ${id} Deleted . `,
      status: HttpStatus.OK,
    });
  }
}
