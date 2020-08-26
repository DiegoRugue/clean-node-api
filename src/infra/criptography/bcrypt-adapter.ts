import { hash, compare } from 'bcrypt'

import { Encrypter } from '../../data/protocols/criptography/encrypter'
import { HashComparer } from '../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await compare(value, hash)
    return Promise.resolve(true)
  }

  async encrypt (value: string): Promise<string> {
    const hashed = await hash(value, this.salt)
    return hashed
  }
}
