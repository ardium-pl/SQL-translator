import { ButtonConfig } from "./button-config";

type CardType = 'default' | 'input';

export interface CardConfig {
  type: CardType;
  title: string;
  placeholderText?: string;
  buttonConfig?: ButtonConfig;
  submitAction?: (userInput: string) => void;
}
