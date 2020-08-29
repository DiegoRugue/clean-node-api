import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { serverError, create } from '../../presentation/helpers/http/http-helper'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { AccountModel } from '../../domain/models/account'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(create(makeFakeAccount()))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve(null)
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepository: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepository)
  return {
    sut,
    controllerStub,
    logErrorRepository
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(create(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut()
    const logSpy = jest.spyOn(logErrorRepository, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
