import { compare, hash } from "bcrypt";
import { Document, Model, model, ObjectId, Schema } from "mongoose";

export interface User {
  name: string;
  email: string;
  password?: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface UserDocument extends User, UserMethods, Document {
  _id: ObjectId;
}

const userSchema = new Schema<
  UserDocument,
  Model<UserDocument, {}, UserMethods>,
  UserMethods
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: {
        url: String,
        publicId: String,
      },
      _id: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password!, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await compare(password, this.password!);
  return isMatch;
};

export default model<UserDocument>("User", userSchema);
