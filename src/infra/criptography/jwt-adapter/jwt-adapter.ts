import jwt from 'jsonwebtoken'
import { TokenGenerator } from '../../../data/protocols/criptography/token-generator'

export class JwtAdapter implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generate (id: string): Promise<string> {
    const accessToken = await jwt.sign({ id }, this.secret)
    return accessToken
  }
}
