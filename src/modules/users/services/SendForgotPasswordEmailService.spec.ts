import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/appError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let mailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let recoverPassword: SendForgotPasswordEmailService;

describe('SendForgotEmailPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    mailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    recoverPassword = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      mailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendEmail = jest.spyOn(mailProvider, 'sendMail');

    fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await recoverPassword.execute({
      email: 'gustavo@hotmail.com',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      recoverPassword.execute({
        email: 'gustavo@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should a generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const { id } = await fakeUsersRepository.create({
      name: 'Gustavo',
      email: 'gustavo@hotmail.com',
      password: '123456',
    });

    await recoverPassword.execute({
      email: 'gustavo@hotmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(id);
  });
});
