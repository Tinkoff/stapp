export type ValidationFlags = {
  onInit?: boolean
  onChange?: boolean
  onRevalidate?: boolean
}

export type ValidationRule<State> = (
  value: string | void,
  fieldName: string,
  state: State,
  flags: ValidationFlags
) => any

export type ValidationRules<State> = {
  [K: string]: ValidationRule<State>
}

export type ValidationState = {
  validating: { [K: string]: boolean }
}

export type ValidateConfig<State> = {
  rules: ((state: State) => ValidationRules<State>) | ValidationRules<State>
  validateOnInit?: boolean
  setTouchedOnSubmit?: boolean
}
