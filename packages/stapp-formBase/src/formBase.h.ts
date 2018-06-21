export type FormBaseState<Values = any, ReadyKeys extends string = any> = {
  values: Values
  errors: { [K in keyof Values]: any }
  touched: { [K in keyof Values]: boolean }
  dirty: { [K in keyof Values]: boolean }
  active: keyof Values | null
  ready: { [K in ReadyKeys]: boolean }
  pristine: boolean
}

export type FormBaseConfig<FormValues> = {
  initialValues?: FormValues
}
