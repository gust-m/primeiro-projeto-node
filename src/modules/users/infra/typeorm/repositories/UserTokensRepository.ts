import { getRepository, Repository } from 'typeorm';
import AppError from '@shared/errors/appError';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

export class UserTokenRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    if (!userToken) {
      throw new AppError('Token does not exists');
    }

    return userToken;
  }
}

export default UserTokenRepository;
