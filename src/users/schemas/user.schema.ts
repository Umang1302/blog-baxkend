import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  googleId?: string;
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false }) // Optional for OAuth users
  password?: string;

  @Prop({
    type: String,
    enum: ["local", "google"],
    default: "google",
  })
  authProvider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
