import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/appError';

import User from '@modules/users/infra/typeorm/entities/User';

import { classToClass } from 'class-transformer';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByUserId(user_id);

    if (!user) {
      throw new AppError('User does not existis');
    }

    return classToClass(user);
  }
}

export default ShowProfileService;
