import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";

describe("UsersService", () => {
  let service: UsersService;

  const mockUser = {
    _id: "1",
    googleId: "abc",
    name: "Test User",
    email: "test@example.com",
    authProvider: "google",
  };

  const findOneMock = jest.fn().mockResolvedValue(mockUser);
  const findByIdMock = jest.fn().mockResolvedValue(mockUser);
  const findMock = jest.fn().mockResolvedValue([mockUser]);

  class MockUserModel {
    static findOne = findOneMock;
    static findById = findByIdMock;
    static find = findMock;

    constructor(private data: Partial<User>) {
      Object.assign(this, data);
    }

    save = jest.fn().mockResolvedValue(mockUser);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user", async () => {
    const newUser = {
      name: "John",
      email: "john@example.com",
      googleId: "g123",
      authProvider: "google",
    };

    const result = await service.create(newUser);
    expect(result).toEqual(mockUser);
  });

  it("should find user by Google ID", async () => {
    const result = await service.findByGoogleId("abc");
    expect(result).toEqual(mockUser);
    expect(MockUserModel.findOne).toHaveBeenCalledWith({ googleId: "abc" });
  });

  it("should find user by email", async () => {
    const email = "test@example.com";
    const result = await service.findByEmail(email);
    expect(result).toEqual(mockUser);
    expect(MockUserModel.findOne).toHaveBeenCalledWith({ email });
  });

  it("should find user by id", async () => {
    const id = "1";
    const result = await service.findById(id);
    expect(result).toEqual(mockUser);
    expect(MockUserModel.findById).toHaveBeenCalledWith(id);
  });

  it("should return all users", async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
    expect(MockUserModel.find).toHaveBeenCalled();
  });
});
