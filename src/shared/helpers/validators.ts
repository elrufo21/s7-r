import { RegisterOptions } from 'react-hook-form'

export const required = (message = ''): RegisterOptions => ({
  required: { value: true, message },
})
