import { Test, TestingModule } from "@nestjs/testing";
import { PostsService } from "./posts.service";
import { getModelToken } from "@nestjs/mongoose";
import { Post } from "./schemas/post.schema";

describe("PostsService", () => {
  let service: PostsService;

  const mockPost = {
    _id: "post123",
    title: "Test Title",
    body: "Test Body",
    userId: "user123",
  };

  class MockPostModel {
    title: string;
    body: string;
    userId: string;

    constructor(data: Partial<Post>) {
      this.title = data.title!;
      this.body = data.body!;
      this.userId = data.userId!;
    }

    save() {
      return Promise.resolve({
        _id: "post123",
        title: this.title,
        body: this.body,
        userId: this.userId,
      });
    }

    static find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockPost]),
    });

    static findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPost),
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: MockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a post", async () => {
    const result = await service.create("user123", "Test Title", "Test Body");
    expect(result).toEqual(mockPost);
  });

  it("should find all posts by user", async () => {
    const result = await service.findAllByUser("user123");
    expect(MockPostModel.find).toHaveBeenCalledWith({ userId: "user123" });
    expect(result).toEqual([mockPost]);
  });

  it("should find post by ID", async () => {
    const result = await service.findById("post123");
    expect(MockPostModel.findById).toHaveBeenCalledWith("post123");
    expect(result).toEqual(mockPost);
  });
});
