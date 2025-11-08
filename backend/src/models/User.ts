import mongoose, { Schema, model } from "mongoose";

interface  IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] },
});

export default mongoose.models.User || model<IUser>("User", userSchema);