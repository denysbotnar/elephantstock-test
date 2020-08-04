import { IUserDocument, IUserModel, UserModel } from '../models/user.model';
import { FilterQuery } from 'mongoose';

interface ISearchData {
  roleId?: number;
  search?: string;
}

export interface IUserRepository {
  all(conditions?: FilterQuery<IUserDocument>): Promise<IUserDocument[]>;
  search(data: ISearchData): Promise<IUserDocument[]>;
  exists(conditions: FilterQuery<IUserDocument>): Promise<boolean>;
  findOne(conditions: FilterQuery<IUserDocument>): Promise<IUserDocument | null>;
}

export class UserRepository implements IUserRepository {
  model: IUserModel;

  constructor() {
    this.model = UserModel;
  }

  public async all(conditions: FilterQuery<IUserDocument> = {}): Promise<IUserDocument[]> {
    return this.model.find(conditions);
  }

  public async search(data: ISearchData): Promise<IUserDocument[]> {
    const { roleId, search } = data;

    let conditions: any = {};
    if (roleId) conditions.roleId = roleId;

    if (search) {
      conditions.$or = [
        {
          firstname: { $regex: search, $options: 'i' },
        },
        {
          lastname: { $regex: search, $options: 'i' },
        },
        {
          email: { $regex: search, $options: 'i' },
        },
      ];
    }

    return this.all(conditions);
  }

  public async exists(conditions: FilterQuery<IUserDocument>): Promise<boolean> {
    return this.model.exists(conditions);
  }

  public async findOne(conditions: FilterQuery<IUserDocument>): Promise<IUserDocument | null> {
    return this.model.findOne(conditions);
  }
}
