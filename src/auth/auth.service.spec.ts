import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("mocked.jwt.token"),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByGoogleId: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should return user without password if password matches", async () => {
      const user = {
        email: "test@example.com",
        password: await bcrypt.hash("1234", 10),
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser("test@example.com", "1234");
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
    });

    it("should return null if user not found", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser("notfound@example.com", "1234");
      expect(result).toBeNull();
    });

    it("should return null if password does not match", async () => {
      const user = {
        email: "test@example.com",
        password: await bcrypt.hash("wrong", 10),
      };
      mockUsersService.findByEmail.mockResolvedValue(user);
      const result = await service.validateUser("test@example.com", "1234");
      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("should return access token", async () => {
      const token = await service.login({ _id: "user123" });
      expect(token).toEqual({ access_token: "mocked.jwt.token" });
    });
  });

  describe("register", () => {
    it("should create user and return access token", async () => {
      const newUser = { _id: "user123" };
      mockUsersService.create.mockResolvedValue(newUser);
      const result = await service.register(
        "John",
        "john@example.com",
        "password123"
      );
      expect(result).toEqual({ access_token: "mocked.jwt.token" });
    });
  });

  describe("validateOAuthLogin", () => {
    it("should throw error if no email", async () => {
      await expect(service.validateOAuthLogin({ emails: [] })).rejects.toThrow(
        "No email found in profile"
      );
    });

    it("should return token for existing user", async () => {
      mockUsersService.findByEmail.mockResolvedValue({ _id: "user123" });

      const token = await service.validateOAuthLogin({
        emails: [{ value: "test@example.com" }],
        displayName: "Test",
      });

      expect(token).toEqual({ access_token: "mocked.jwt.token" });
    });

    it("should create new user and return token if user not found", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ _id: "user123" });

      const token = await service.validateOAuthLogin({
        emails: [{ value: "test@example.com" }],
        displayName: "New User",
      });

      expect(token).toEqual({ access_token: "mocked.jwt.token" });
    });
  });

  describe("validateGoogleUser", () => {
    it("should return token for existing Google user", async () => {
      mockUsersService.findByGoogleId.mockResolvedValue({ _id: "googleUser" });

      const token = await service.validateGoogleUser({
        id: "g123",
        displayName: "Google User",
        emails: [{ value: "google@example.com" }],
      });

      expect(token).toEqual({ access_token: "mocked.jwt.token" });
    });

    it("should create user and return token if Google user not found", async () => {
      mockUsersService.findByGoogleId.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ _id: "newGoogleUser" });

      const token = await service.validateGoogleUser({
        id: "g123",
        displayName: "Google User",
        emails: [{ value: "google@example.com" }],
      });

      expect(token).toEqual({ access_token: "mocked.jwt.token" });
    });
  });
});
