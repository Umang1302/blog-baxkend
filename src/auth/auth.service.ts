import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { User } from "../users/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private generateToken(userId: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId }),
    };
  }

  async validateUser(email: string, password: string) {
    const user: any = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    return this.generateToken(user._id);
  }

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
    });
    return this.login(user);
  }

  async validateOAuthLogin(profile: any) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error("No email found in profile");

    let user: any = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        name: profile.displayName || profile.username,
        email,
        password: undefined,
        authProvider: "google",
      });
    }

    return this.generateToken(user._id);
  }

  async validateGoogleUser(profile: any): Promise<{ access_token: string }> {
    const { id: googleId, displayName: name, emails } = profile;
    const email = emails?.[0]?.value;

    let user: any = await this.usersService.findByGoogleId(googleId);
    if (!user) {
      user = await this.usersService.create({
        googleId,
        email,
        name,
        authProvider: "google",
      });
    }

    return this.generateToken(user._id);
  }
}
