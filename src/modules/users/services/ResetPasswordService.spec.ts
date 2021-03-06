import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/appError';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset the password', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(id);

    await resetPassword.execute({
      token,
      password: '123123',
    });

    const updatedUser = await fakeUsersRepository.findByUserId(id);

    expect(updatedUser?.password).toBe('123123');
  });
});
