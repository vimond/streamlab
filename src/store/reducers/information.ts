import { AppState, BaseAppState } from './index';
import { AnyAction } from 'redux';
import { Message, MessageResolver, MessageRule } from '../model/messageResolver';
import { REHYDRATE } from 'redux-persist/lib/constants';

export interface InformationState {
  messages: Message[];
}

const createRootReducerWithInformation = (rules: MessageRule[], messageResolver: MessageResolver) => (
  prevState: AppState | undefined,
  action: AnyAction,
  nextState: BaseAppState
): AppState => {
  if (action.type === REHYDRATE) {
    return {
      ...nextState,
      ...action.payload,
      information: {
        messages: messageResolver(rules, prevState, action, { ...nextState, ...action.payload }),
      },
    };
  } else {
    return {
      ...nextState,
      information: {
        messages: messageResolver(rules, prevState, action, nextState),
      },
    };
  }
};

export default createRootReducerWithInformation;
