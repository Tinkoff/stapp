export type FormBaseState<Values = any> = {
  values: Values
  errors: { [K in keyof Values]: any }
  touched: { [K in keyof Values]: boolean }
  dirty: { [K in keyof Values]: boolean }
  active: keyof Values | null
  ready: { [K: string]: boolean }
  pristine: boolean
  submitting: boolean
}

export type FormBaseConfig<FormValues> = {
  initialValues?: FormValues
}
