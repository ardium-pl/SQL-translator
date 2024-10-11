export const ButtonType = {
  button: 'button',
  submit: 'submit',
  reset: 'reset',
} as const;
export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];
