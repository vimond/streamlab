import { AppState, BaseAppState } from '../reducers';
import { Action } from '../actions';

export enum MessageLevel {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export type Message = {
  level: MessageLevel;
  text: string;
};

export type MessageRule = {
  id: string;
  displayCondition: ({
    action,
    prevState,
    nextState
  }: {
    action: Action;
    prevState: AppState | undefined;
    nextState: BaseAppState;
  }) => boolean;
  message: Message | ((state: BaseAppState, action: Action) => Message);
};

export type MessageResolver = (
  messageRules: MessageRule[],
  prevState: AppState | undefined,
  action: Action,
  nextState: BaseAppState
) => Message[];

export const resolveMessages: MessageResolver = (messageRules, prevState, action, nextState) =>
  messageRules
    .filter(rule => rule.displayCondition({ action, prevState, nextState }))
    .map(rule => (typeof rule.message === 'function' ? rule.message(nextState, action) : rule.message));
