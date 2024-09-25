import { ButtonConfig } from './button-config';
import { RowMYSQL } from './row-mysql';

type CardType = 'default' | 'input' | 'grid';

interface BaseCardConfig {
  type: CardType;
  title: string;
  placeholderText?: string;
  buttonConfig?: ButtonConfig;
  submitAction?: (userInput: string) => void;
}

export interface DefaultCardConfig extends BaseCardConfig {
  type: 'default';
}

export interface InputCardConfig extends BaseCardConfig {
  type: 'input';
  buttonConfig: ButtonConfig;
  submitAction: (userInput: string) => void;
}

export interface GridCardConfig extends BaseCardConfig {
  type: 'grid';
}
