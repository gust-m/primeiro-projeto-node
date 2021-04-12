import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/appError';

import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { classToClass } from 'class-transformer';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByUserId(user_id);

    if (!user) {
      throw new AppError('User does not existis');
    }

    const findUserByEmail = await this.usersRepository.findByEmail(email);

    if (findUserByEmail && findUserByEmail.id !== user_id) {
      throw new AppError('Email already in use');
    }

    console.log(user_id, name, email, old_password, password);

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Incorrect old password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    await this.usersRepository.save(user);

    return classToClass(user);
  }
}

export default UpdateProfileService;
