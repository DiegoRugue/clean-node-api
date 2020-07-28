import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    if (!requiredFields[field]) {
      validations.push(new RequiredFieldValidation(field))
    }
  }
  return new ValidationComposite(validations)
}
