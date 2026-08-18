import mongoose, { Schema, Types, model } from "mongoose";
import { Gender, UserRole } from "../../common/enum/user.enum.js";

export interface UserI {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  password: string;
  dateOfBirth: Date;
  gender: Gender;
  role: UserRole;
  fcmTokens: string[];
}

const userSchema = new Schema<UserI>(
  {
    _id: { type: Types.ObjectId },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: undefined,
    },

    password: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PATIENT,
      required: true,
    },

    fcmTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.models.User || model<UserI>("User", userSchema);
export default userModel;
