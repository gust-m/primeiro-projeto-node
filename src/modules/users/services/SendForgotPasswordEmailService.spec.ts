import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotEmailPassword', () => {
  it('should be able to recover the password using the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const mailProvider = new FakeMailProvider();

    const recoverPassword = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      mailProvider,
    );

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
});
