import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

describe('Required Field Validation', () => {
  test('Should return InvalidParamError if EmailValidator returns false', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
