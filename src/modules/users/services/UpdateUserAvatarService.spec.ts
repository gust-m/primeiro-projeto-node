import AppError from '@shared/errors/appError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStoraProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStoraProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStoraProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to save a new avatar user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'abcdef',
    });

    expect(user.avatar).toBe('abcdef');
  });
});

describe('UpdateUserAvatar', () => {
  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe('UpdateUserAvatar', () => {
  it('should delete the old avatar file before adding the new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'firstAvatar',
    });

    const newUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'secondAvatar',
    });

    expect(deleteFile).toBeCalledWith('firstAvatar');
    expect(newUser.avatar).toBe('secondAvatar');
  });
});
