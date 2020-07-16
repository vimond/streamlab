import { MessageLevel, MessageRule, resolveMessages } from '../../../store/model/messageResolver';
import { PANE_RESIZE } from '../../../store/actions/ui';
import { PLAYER_ERROR } from '../../../store/actions/player';

describe('Information message resolver', () => {
  test('Returning all messages matching the condition in the rule.', () => {
    const rules: MessageRule[] = [
      {
        id: 'rule-a',
        displayCondition: ({ nextState }) => nextState.ui.rightPaneWidth === 313,
        message: {
          level: MessageLevel.SUCCESS,
          text: 'Message A',
        },
      },
      {
        id: 'rule-b',
        displayCondition: ({ prevState, nextState, action }) =>
          !!prevState &&
          !!prevState.player.source &&
          nextState.ui.rightPaneWidth === 424 &&
          action.type === PANE_RESIZE,
        message: {
          level: MessageLevel.INFO,
          text: 'Message B',
        },
      },
      {
        id: 'rule-c',
        displayCondition: ({ action }) => action.type === PLAYER_ERROR,
        message: {
          level: MessageLevel.ERROR,
          text: 'Message C',
        },
      },
      {
        id: 'rule-d',
        displayCondition: () => true,
        message: {
          level: MessageLevel.WARNING,
          text: 'Message D',
        },
      },
    ];
    const prevState1 = undefined;
    const nextState1 = {
      ui: {
        advancedMode: false,
        rightPaneWidth: 0,
      },
    };
    const action1 = { type: 'SOMETHING' };

    // @ts-ignore No need to build a full state object, so suppressing type checks requiring so.
    const result1 = resolveMessages(rules, prevState1, action1, nextState1);
    expect(result1).toEqual([{ level: MessageLevel.WARNING, text: 'Message D' }]);

    const prevState2 = {
      player: {
        source: {},
      },
    };
    const nextState2 = {
      ui: {
        advancedMode: false,
        rightPaneWidth: 424,
      },
    };
    const action2 = { type: PANE_RESIZE };

    // @ts-ignore
    const result2 = resolveMessages(rules, prevState2, action2, nextState2);
    expect(result2).toEqual([
      {
        level: MessageLevel.INFO,
        text: 'Message B',
      },
      {
        level: MessageLevel.WARNING,
        text: 'Message D',
      },
    ]);

    const nextState3 = {
      ui: {
        rightPaneWidth: 313,
      },
    };

    // @ts-ignore
    const result3 = resolveMessages(rules, undefined, {}, nextState3);
    expect(result3).toEqual([
      {
        level: MessageLevel.SUCCESS,
        text: 'Message A',
      },
      {
        level: MessageLevel.WARNING,
        text: 'Message D',
      },
    ]);

    const nextState4 = {
      ui: {},
    };
    const action4 = { type: PLAYER_ERROR };

    // @ts-ignore
    const result4 = resolveMessages(rules, undefined, action4, nextState4);
    expect(result4).toEqual([
      {
        level: MessageLevel.ERROR,
        text: 'Message C',
      },
      {
        level: MessageLevel.WARNING,
        text: 'Message D',
      },
    ]);
  });

  test('Message formatting based on current state and/or action', () => {
    const rules: MessageRule[] = [
      {
        id: 'rule-a',
        displayCondition: () => true,
        message: (state, action) => ({
          level: MessageLevel.INFO,
          text: `Message A: ${state.ui.rightPaneWidth} ${action.type}`,
        }),
      },
      {
        id: 'rule-b',
        displayCondition: () => true,
        message: (state, action) => ({
          level: MessageLevel.WARNING,
          text: `Message B: ${JSON.stringify(action)}`,
        }),
      },
    ];
    const result = resolveMessages(
      rules,
      undefined,
      { type: PANE_RESIZE, value: 313 },
      // @ts-ignore
      { ui: { advancedMode: true, rightPaneWidth: 535, expandedAdvancedAccordionIndices: [1] } }
    );
    expect(result).toEqual([
      {
        level: MessageLevel.INFO,
        text: 'Message A: 535 PANE_RESIZE',
      },
      {
        level: MessageLevel.WARNING,
        text: 'Message B: {"type":"PANE_RESIZE","value":313}',
      },
    ]);
  });
});
