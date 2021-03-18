import { getRepository, Repository, Not } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

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

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    if (except_user_id) {
      const users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });

      return users;
    }
    return this.ormRepository.find();
  }
}

export default UsersRepository;
