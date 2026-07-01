import { Body, Controller, Get, Post, Res, HttpStatus,Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import type { Response } from 'express';
import { Public } from './decorator/public.decorator.js';
import { RoleDto } from './dto/role.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const register = await this.authService.register(
      registerDto.mobile,
      registerDto.display_name,
      registerDto.password,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      body: register,
      message: ' Register is done . ',
      status: HttpStatus.OK,
    });
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const login = await this.authService.login(
      loginDto.mobile,
      loginDto.password,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      body: login,
      message: ' Login is done . ',
      status: HttpStatus.OK,
    });
  }

  // @ApiBearerAuth()
  @Get('getUserPermission/:userId')
  async getUserPermission(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const permission = await this.authService.getUserPermission(userId);
  }

  // @ApiBearerAuth()
  @Post('role')
  async ceateRole(@Body() createRole: RoleDto, @Res() res: Response) {
    if (Array.isArray(createRole.name)) {
      await Promise.all(
        createRole.name.map(async (p) => {
          return await this.authService.createRole(p);
        }),
      );
    } else {
      await this.authService.createRole(createRole?.name);
    }

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: ` Role(s) is Created`,
      status: HttpStatus.CREATED,
    });
  }

  // @ApiBearerAuth()
  @Post('permission')
  async createPermission(
    @Body() createPermission: createPermissionDto,
    @Res() res: Response,
  ) {
    let createdPermission: { name: string } | { name: string }[];

    if (Array.isArray(createPermission.name)) {
      createdPermission = await Promise.all(
        createPermission.name.map(async (p) => {
          return await this.authService.createPermission(p);
        }),
      );
    } else {
      createdPermission = await this.authService.createPermission(
        createPermission?.name,
      );
    }

    return res.status(HttpStatus.CREATED).json({
      success: true,
      data: createdPermission,
      message: ` Permission is Created`,
      status: HttpStatus.CREATED,
    });
  }

  // @ApiBearerAuth()
  @Post('role/append-to-user')
  async addRoleToUser(@Body() roleToUser: RoleToUserDto, @Res() res: Response) {
    const result = await this.authService.addRoleToUser(
      roleToUser.userId,
      roleToUser.roleId,
    );
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: ' Role is added . ',
      status: HttpStatus.CREATED,
    });
  }

  // @ApiBearerAuth()
  @Post('role/remove-from-user')
  async removeRoleFromUser(
    @Body() roleToUser: RoleToUserDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.removeRoleFromUser(
      roleToUser.userId,
      roleToUser.roleId,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ' Role is Deleted . ',
      status: HttpStatus.OK,
    });
  }

  // @ApiBearerAuth()
  @Get('role/get-user-roles/:userId')
  async getUserRoles(@Param('userId') userId: number, @Res() res: Response) {
    const result = await this.authService.getUserRoles(userId);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ' Role is Deleted . ',
      status: HttpStatus.OK,
    });
  }

  // @ApiBearerAuth()
  @Post('permission/append-to-role')
  async addPermissionToRole(
    @Body() permissionToRole: PermissionToRoleDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.addPermissionToRole(
      permissionToRole.roleId,
      permissionToRole.permissionId,
    );
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: ' Role is added . ',
      status: HttpStatus.CREATED,
    });
  }

  // @ApiBearerAuth()
  @Get('permission/get-role-pesrmissions/:roleId')
  async getRolePermissions(
    @Param('roleId') roleId: number,
    @Res() res: Response,
  ) {
    const result = await this.authService.getRolePermissions(roleId);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ' Role is Deleted . ',
      status: HttpStatus.OK,
    });
  }

  // @ApiBearerAuth()
  @Post('permission/append-to-user')
  async addPermissionToUser(
    @Body() permissionToUser: PermissionToUserDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.addPermissionToRole(
      permissionToUser.userId,
      permissionToUser.permissionId,
    );
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: ' Permission is added . ',
      status: HttpStatus.CREATED,
    });
  }

  // @ApiBearerAuth()
  @Get('permission/get-user-pesrmissions/:userId')
  async getUserPermissions(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const result = await this.authService.getUserPermission(userId);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ' Permissions returned . ',
      status: HttpStatus.OK,
    });
  }
}
