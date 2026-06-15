import { Body, Controller,Post,Res,HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { AuthService } from "./auth.service.js";
import type { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
//   @Public()
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

//   @Public()
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
}