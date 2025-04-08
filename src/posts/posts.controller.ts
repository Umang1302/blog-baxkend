import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() body: { title: string; body: string }) {
    const userId = req.user?._id;
    if (!userId) {
      throw new BadRequestException("User ID is missing in the token");
    }

    return this.postsService.create(userId, body.title, body.body);
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  async getPostsByUser(@Req() req: any) {
    return this.postsService.findAllByUser(req.user._id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    console.log(id);
    return this.postsService.findById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param("id") id: string,
    @Req() req,
    @Body() body: { title?: string; body?: string }
  ) {
    const userId = req.user?._id;
    return this.postsService.update(id, userId, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param("id") id: string, @Req() req) {
    const userId = req.user?._id;
    return this.postsService.delete(id, userId);
  }
}
