import { Field } from '../schemas';
import { isAlpha, isEmail, isPassword } from '../helpers';

export class UniqueConstraintError extends Error {
  constructor (value: string) {
    super(`${value} must be unique.`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError)
    }
  }
}

export class InvalidPropertyError extends Error {
  constructor (msg: string) {
    super(msg)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}

export class RequiredParameterError extends Error {
  constructor (param: string) {
    super(`${param} can not be null or undefined.`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError)
    }
  }
}

export class DriverError extends Error {
  constructor (param: string) {
    super(`An error ${param} occurred`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError)
    }
  }
}

export const handleModelRulesCompiliance = (field: any, rules: Field) => {
  const tempFix = rules.type.toString().split("()")[0].split(" ")[1].toLowerCase();
  
  const acceptableField = field.constructor == rules.type.toString() 
    ? field.toString().trim() : field;

  if (rules.required && !acceptableField)
    throw `${rules.name} is required.`;
  
  if (field.constructor === String && !isAlpha(acceptableField))
    throw `${rules.name} must be a ${tempFix}.`; 

    // Check for role validity
  if (rules.minlength)
    if (rules.minlength > field?.length)
      throw `${rules.name} must be ${rules.minlength} characters long or more.`;

  if (rules.maxlength)
    if (rules.maxlength > field?.length)
      throw `${rules.name} must be of maximum ${rules.maxlength} characters long.`;
  
  if (rules.type !== field.constructor) 
      throw `${rules.name} must be a ${tempFix}.`;

}