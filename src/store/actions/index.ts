import { ToggleAdvancedModeAction } from './ui';
import { StreamDetailsFieldChangeAction } from './streamDetails';
import { PlayerAction, PlayerErrorAction } from './player';

export type Action = ToggleAdvancedModeAction | StreamDetailsFieldChangeAction | PlayerAction | PlayerErrorAction;
