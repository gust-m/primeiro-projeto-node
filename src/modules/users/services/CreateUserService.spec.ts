import AppError from '@shared/errors/appError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('name');
  });
});

describe('CreateUser', () => {
  it('should not be able to create a new users with same email from another', async () => {
    const fakeUsersRep = new FakeUsersRepository();
    const fakeHashPro = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUsersRep, fakeHashPro);
    const userEmail = 'gustavo@hotmail.com';

    await createUser.execute({
      name: 'Gustavo',
      email: userEmail,
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Gustavo',
        email: userEmail,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
