import User from '@modules/users/infra/typeorm/entities/User';

export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
