import AppError from '@shared/errors/appError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      email: 'gustavo1@hotmail.com',
      name: 'New-Name',
    });

    expect(user.email).toBe('gustavo1@hotmail.com');
    expect(user.name).toBe('New-Name');
  });

  it('should not be able update the profile with a non-existing user', async () => {
    await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: 'non-existing-userID',
        email: 'gustavo1@hotmail.com',
        name: 'New-Name',
        oldPassword: '123456',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the profile with a incorrect password user', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: id,
        email: 'gustavo1@hotmail.com',
        name: 'New-Name',
        oldPassword: 'wrongPassword',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    const { id } = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo123@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: id,
        email: 'gustavo@hotmail.com',
        name: 'New-Name',
        oldPassword: '123456',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change only name user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      email: 'gustavo@hotmail.com',
      name: 'New-Name',
      oldPassword: '123456',
      password: '123123',
    });

    expect(user.name).toBe('New-Name');
  });

  it('should not be able change the password without provider the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'gustavo@hotmail.com',
        name: 'New-Name',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able update the profile with password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      email: 'gustavo1@hotmail.com',
      name: 'New-Name',
      oldPassword: '123456',
      password: '123123',
    });

    expect(user.password).toBe('123123');
    expect(user.email).toBe('gustavo1@hotmail.com');
    expect(user.name).toBe('New-Name');
  });
});
