import { AnyAction, combineReducers } from 'redux';
import ui from './ui';
import streamDetails from './streamDetails';
import player from './player';
import playerOptions from './playerOptions';
import history from './history';
import createRootReducerWithInformation, { InformationState } from './information';
import { messages } from '../model/messages';
import { resolveMessages } from '../model/messageResolver';

const rootReducer = combineReducers({
  ui,
  streamDetails,
  player,
  playerOptions,
  history,
  information: () => ({})
});

const getRootState = createRootReducerWithInformation(messages, resolveMessages);

export type BaseAppState = ReturnType<typeof rootReducer>;
export type AppState = BaseAppState & { information: InformationState };

export default (state: AppState | undefined, action: AnyAction) =>
  getRootState(state, action, rootReducer(state, action));
