import createRootReducerWithInformation from '../../../store/reducers/information';
import { MessageLevel } from '../../../store/model/messageResolver';
import { REHYDRATE } from 'redux-persist/lib/constants';

const rules = [
  {
    id: 'all',
    displayCondition: () => true,
    message: {
      level: MessageLevel.SUCCESS,
      text: 'This is fine.'
    }
  }
];
const prevState = { slice: { value: 1 } };
const nextState = { slice: { value: 2 } };

describe('Information reducer', () => {
  test('Addition of messages to the state, based on current action, previous state, and next state', () => {
    const messageResolver = jest.fn().mockReturnValue([rules[0].message]);
    const getRootState = createRootReducerWithInformation(rules, messageResolver);
    const action = { type: 'SOME_ACTION' };

    // @ts-ignore No need to fulfilling the type requirements implying supplying full state objects.
    const result = getRootState(prevState, action, nextState);
    expect(messageResolver).toHaveBeenCalledWith(rules, prevState, action, nextState);
    expect(result).toEqual({
      slice: { value: 2 },
      information: {
        messages: [
          {
            level: MessageLevel.SUCCESS,
            text: 'This is fine.'
          }
        ]
      }
    });
  });
  test(
    'Handling the redux-persist REHYDRATE action type, ' +
      'so that the rehydrated payload is included as the next state.',
    () => {
      const messageResolver = jest.fn().mockReturnValue([rules[0].message]);
      const getRootState = createRootReducerWithInformation(rules, messageResolver);
      const action = { type: REHYDRATE, payload: { slice: { setting: true } } };

      // @ts-ignore No need to fulfilling the type requirements implying supplying full state objects.
      const result = getRootState(prevState, action, nextState);
      expect(messageResolver).toHaveBeenCalledWith(rules, prevState, action, {
        ...nextState,
        ...{ slice: { setting: true } }
      });
      expect(result).toEqual({
        slice: { setting: true },
        information: {
          messages: [
            {
              level: MessageLevel.SUCCESS,
              text: 'This is fine.'
            }
          ]
        }
      });
    }
  );
});
