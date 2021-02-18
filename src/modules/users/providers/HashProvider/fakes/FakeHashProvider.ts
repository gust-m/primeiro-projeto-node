import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(
    payload: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return payload === hashedPassword;
  }
}
