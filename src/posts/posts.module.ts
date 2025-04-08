import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { Post, PostSchema } from "./schemas/post.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostsService, JwtAuthGuard],
  controllers: [PostsController],
})
export class PostsModule {}
