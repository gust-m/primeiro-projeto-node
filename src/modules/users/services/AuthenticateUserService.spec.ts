import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/appError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import { classToClass } from 'class-transformer';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(classToClass(user));
  });
});

describe('AuthenticateUser', () => {
  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'non-existing-user',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe('AuthenticateUser', () => {
  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Jhon',
      email: 'jhon@hotmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'jhon@hotmail.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
