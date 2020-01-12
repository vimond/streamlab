import { HistoryEntry } from '../model/history';
import {
  DELETE_HISTORY,
  DELETE_HISTORY_ENTRY,
  DeleteHistoryAction,
  HistoryEntryAction,
  HistoryEntryFilter,
  SELECT_HISTORY_ENTRY,
  SET_HISTORY_LIST_FILTER,
  SetHistoryFilterAction,
  UPDATE_HISTORY_ENTRY_NAME,
  UpdateSelectedHistoryEntryNameAction
} from '../actions/history';
import { PLAY, PLAYER_ERROR, PlayerAction, PlayerErrorAction } from '../actions/player';

export interface HistoryState {
  selectedEntry?: HistoryEntry;
  history: HistoryEntry[];
  historyListFilter: HistoryEntryFilter;
}

const history = (
  state: HistoryState = {
    history: [],
    historyListFilter: HistoryEntryFilter.BOTH
  },
  action:
    | HistoryEntryAction
    | UpdateSelectedHistoryEntryNameAction
    | DeleteHistoryAction
    | SetHistoryFilterAction
    | PlayerAction
    | PlayerErrorAction
): HistoryState => {
  switch (action.type) {
    case SELECT_HISTORY_ENTRY:
      return {
        ...state,
        selectedEntry: action.value
      };
    case UPDATE_HISTORY_ENTRY_NAME:
      if (state.selectedEntry) {
        return {
          ...state,
          selectedEntry: {
            ...state.selectedEntry,
            name: action.value
          }
        };
      } else {
        return state;
      }
    case DELETE_HISTORY_ENTRY: {
      const index = state.history.findIndex(entry => entry.timestamp === action.value.timestamp);
      const history = state.history.slice(0);
      history.splice(index, 1);
      return {
        ...state,
        selectedEntry: undefined,
        history
      };
    }
    case DELETE_HISTORY:
      return {
        history: [],
        historyListFilter: state.historyListFilter
      };
    case SET_HISTORY_LIST_FILTER:
      return {
        ...state,
        historyListFilter: action.value
      };
    case PLAY: {
      const history = state.history.concat(action.value.historyEntry);
      return {
        ...state,
        history
      };
    }
    case PLAYER_ERROR: {
      const prevHistory = state.history;
      const history = prevHistory.slice(0, prevHistory.length - 1);
      const latestItem = prevHistory[prevHistory.length - 1];
      history.push({
        ...latestItem,
        error: action.error
      });
      return {
        ...state,
        history
      };
    }
    default:
      return state;
  }
};

export default history;
