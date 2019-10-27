import { AppState, BaseAppState } from './index';
import { AnyAction } from 'redux';
import { Message, resolveMessages } from '../model/messages';
import { messageRules } from '../messageRules';
import { REHYDRATE } from 'redux-persist/es/constants';

export interface InformationState {
  messages: Message[];
}

const getRootState = (prevState: AppState | undefined, action: AnyAction, nextState: BaseAppState): AppState => {
  if (action.type === REHYDRATE) {
    return {
      ...nextState,
      ...action.payload,
      information: {
        messages: resolveMessages(messageRules, prevState, action, { ...nextState, ...action.payload })
      }
    };
  } else {
    return {
      ...nextState,
      information: {
        messages: resolveMessages(messageRules, prevState, action, nextState)
      }
    };
  }
};

export default getRootState;
