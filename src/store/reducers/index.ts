import { AnyAction, combineReducers } from 'redux';
import ui from './ui';
import streamDetails from './streamDetails';
import player from './player';
import getRootState, { InformationState } from './information';

const rootReducer = combineReducers({
  ui,
  streamDetails,
  player,
  information: () => ({})
});

export type BaseAppState = ReturnType<typeof rootReducer>;
export type AppState = BaseAppState & { information: InformationState };

export default (state: AppState | undefined, action: AnyAction) =>
  getRootState(state, action, rootReducer(state, action));
