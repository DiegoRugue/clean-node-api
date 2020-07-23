import { Controller, HttpRequest, HttpResponse, EmailValidator } from '../signup/protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
        const { email } = httpRequest.body
        const emailValid = this.emailValidator.isValid(email)
        if (!emailValid) {
          return badRequest(new InvalidParamError('email'))
        }
      }
      return Promise.resolve(null)
    } catch (error) {
      return serverError(error)
    }
  }
}
