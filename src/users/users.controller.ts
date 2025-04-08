import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get current logged-in user's profile
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException("User not found");
    const { password, ...rest } = user;
    return rest;
  }

  // Get user by ID
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUserById(@Param("id") id: string) {
    const user: any = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    const { password, ...rest } = user;
    return rest;
  }

  // OPTIONAL: Get all users (e.g. for admin panel or testing)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const users: any = await this.usersService.findAll();
    return users.map((u: any) => {
      const { password, ...rest } = u.toObject();
      return rest;
    });
  }
}
