import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/appError';

import User from '@modules/users/infra/typeorm/entities/User';

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

  public async execute({ user_id }: IRequest): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findByUserId(user_id);

    if (!user) {
      throw new AppError('User does not existis');
    }

    const userReturn = {
      id: user_id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userReturn;
  }
}

export default ShowProfileService;
