import { createValidator } from './base.validator';

const validator = createValidator();

export const searchSchema = validator
  .object()
  .shape({
    search: validator.string(),
    roleId: validator.string(),
  })
  .defined();

export const storeSchema = validator
  .object()
  .shape({
    firstname: validator.string().required().defined(),
    lastname: validator.string().required().defined(),
    email: validator.string().email().required().defined(),
    roleId: validator.number().required().defined(),
  })
  .defined();

export const updateSchema = validator
  .object()
  .shape({
    firstname: validator.string().required().defined(),
    lastname: validator.string().required().defined(),
    email: validator.string().email().required().defined(),
    roleId: validator.number().required().defined(),
  })
  .defined();
