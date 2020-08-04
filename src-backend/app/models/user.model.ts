import { Schema, model, Document, Model } from 'mongoose';

export interface IUserAttributes {
  firstname: string;
  lastname: string;
  email: string;
  roleId: number;
}

export interface IUserDocument extends Document {}

export interface IUserModel extends Model<IUserDocument> {
  roles: { [key in Roles]: number };
}
type Roles = 'DESIGNER' | 'ARTIST' | 'ART_MANAGER';

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  roleId: Number,
});

userSchema.statics.roles = {
  DESIGNER: 1,
  ARTIST: 2,
  ART_MANAGER: 3,
};

export const UserModel = model<IUserDocument, IUserModel>('User', userSchema);
