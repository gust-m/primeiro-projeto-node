import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/appError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
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
    await createUser.execute({
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
