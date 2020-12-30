import { createMigrate } from 'redux-persist';
import { PlayerOptionsState } from './reducers/playerOptions';
import { HistoryState } from './reducers/history';
import { HistoryEntry } from './model/history';

// TODO: Make two explicit types in the reducer, instead of Omit<>ing isModified several places.
type MigratablePlayerOptions = PlayerOptionsState | Omit<PlayerOptionsState, 'isModified'>;

const migratePlayerOptionsV1 = (playerOptions?: MigratablePlayerOptions) => ({
  ...playerOptions,
  playerLibrary: (playerOptions && playerOptions.playerLibrary) || 'AUTO',
});

const migrateHistoryPlayerOptionsV1 = (history: HistoryState): HistoryState => {
  if (history && history.history) {
    return {
      ...history,
      history: history.history.map((historyEntry: HistoryEntry) => {
        if ('playerOptions' in historyEntry.formData) {
          return {
            ...historyEntry,
            formData: {
              ...historyEntry.formData,
              playerOptions: migratePlayerOptionsV1(historyEntry.formData.playerOptions),
            },
          };
        } else {
          return historyEntry;
        }
      }),
    };
  } else {
    return history;
  }
};

const migrations = {
  // Looks like type defs are not correct for migrations. Using any :-(
  1: (state: any) => {
    if (state) {
      return {
        ...state,
        history: migrateHistoryPlayerOptionsV1(state.history),
        playerOptions: migratePlayerOptionsV1(state.playerOptions),
      };
    } else {
      return state;
    }
  },
};

export const migrateConfiguration = {
  version: 1,
  migrate: createMigrate(migrations, { debug: true }),
};
