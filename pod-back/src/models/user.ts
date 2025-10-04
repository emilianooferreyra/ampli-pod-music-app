import { compare, hash } from "bcrypt";
import { Document, Model, model, ObjectId, Schema } from "mongoose";

// Interface para las propiedades del usuario
export interface User {
  name: string;
  email: string;
  password?: string; // Opcional porque a veces no lo devolvemos
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

// Interface para los métodos del documento (instancia)
interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

// Interface para el documento de Mongoose (combina User y Document)
export interface UserDocument extends User, UserMethods, Document {
  _id: ObjectId;
}

// Interface para el modelo estático (no es necesario aquí, pero es buena práctica saberlo)
// interface UserModel extends Model<UserDocument, {}, UserMethods> {}

const userSchema = new Schema<UserDocument, Model<UserDocument, {}, UserMethods>, UserMethods>(
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
      index: true, // Añadido para claridad y rendimiento
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
  const result = await compare(password, this.password!);
  return result;
};

export default model<UserDocument>("User", userSchema);