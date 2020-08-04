import { Request, Response, NextFunction } from 'express';
import { IUserRepository, UserRepository } from '../../repositories/user.repository';
import { IUserService, UserService } from '../../services/user.serivce';
import * as userValidator from '../../validators/user.validator';
import { messagesHelper } from '../../helpers/messages.helper';
import { UserModel } from '../../models/user.model';

export class UserController {
  private readonly userRepository: IUserRepository;
  private readonly userService: IUserService;

  constructor() {
    this.userRepository = new UserRepository();
    this.userService = new UserService();
  }

  public all = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { query } = req;
      const data = await userValidator.searchSchema.validate(query, { abortEarly: false });

      const users = data
        ? await this.userRepository.search({ ...data, roleId: Number(data.roleId) })
        : await this.userRepository.all();

      return res.json({ data: users });
    } catch (e) {
      return next(e);
    }
  };

  public store = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = await userValidator.storeSchema.validate(req.body, { abortEarly: false });
      if (await this.userRepository.exists({ email: data.email })) {
        return next(new Error('Email is not unique'));
      }

      if (data.roleId === UserModel.roles.ART_MANAGER && (await this.userRepository.exists({ roleId: data.roleId }))) {
        return next(new Error('Can be only 1 Art manager'));
      }
      const user = await this.userService.store(data);

      return res.json({ data: user });
    } catch (e) {
      return next(e);
    }
  };

  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { body, params } = req;
      const data = await userValidator.updateSchema.validate(body, { abortEarly: false });

      if (!(await this.userRepository.exists({ _id: params.id }))) {
        return next(new Error('User is not found'));
      }

      if (
        data.roleId &&
        data.roleId === UserModel.roles.ART_MANAGER &&
        (await this.userRepository.exists({ roleId: data.roleId, _id: { $ne: params.id } }))
      ) {
        return next(new Error('Can be only 1 Art manager'));
      }
      const result = await this.userService.updateById(params.id, data);

      return res.json({ data: result, message: messagesHelper.USER_UPDATE_SUCCESS });
    } catch (e) {
      return next(e);
    }
  };

  public destroyById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = await this.userService.destroyById(req.params.id);

      return res.json({ data });
    } catch (e) {
      return next(e);
    }
  };
}
