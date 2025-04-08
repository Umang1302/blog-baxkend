import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "./schemas/post.schema";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(userId: string, title: string, body: string): Promise<Post> {
    const post = new this.postModel({ userId, title, body });
    return post.save();
  }

  async findAllByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ userId }).exec();
  }

  async findById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async update(
    id: string,
    userId: string,
    updateData: { title?: string; body?: string }
  ) {
    const post = await this.postModel.findOne({ _id: id, userId });
    if (!post) throw new Error("Post not found or unauthorized");

    if (updateData.title !== undefined) post.title = updateData.title;
    if (updateData.body !== undefined) post.body = updateData.body;

    return post.save();
  }

  async delete(id: string, userId: string) {
    const result = await this.postModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      throw new Error("Post not found or unauthorized");
    }
    return { message: "Post deleted successfully" };
  }
}
