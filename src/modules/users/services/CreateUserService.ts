import { hash } from 'bcryptjs';

import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/appError';
import ICreateUSerDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUSerDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email adress already used');
    }

    const hasedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hasedPassword,
    });

    return user;
  }
}

export default CreateUserService;
