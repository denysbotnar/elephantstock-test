import { IUserAttributes, IUserDocument, IUserModel, UserModel } from '../models/user.model';

export interface IUserService {
  store(data: IUserAttributes): Promise<IUserDocument>;
  updateById(id: string, data: Partial<IUserAttributes>): Promise<IUserDocument | null>;
  destroyById(id: string): any;
}

export class UserService implements IUserService {
  model: IUserModel;

  constructor() {
    this.model = UserModel;
  }

  public async store(data: IUserAttributes): Promise<IUserDocument> {
    return this.model.create(data);
  }

  public async updateById(id: string, data: Partial<IUserAttributes>): Promise<IUserDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  public destroyById(id: string): any {
    return this.model.findByIdAndDelete(id);
  }
}
