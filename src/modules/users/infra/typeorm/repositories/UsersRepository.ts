import { getRepository, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const createUser = this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(createUser);

    return createUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findOneUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findOneUser;
  }

  public async findByUserId(user_id: string): Promise<User | undefined> {
    const findOneUser = await this.ormRepository.findOne({
      where: { id: user_id },
    });

    return findOneUser;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
