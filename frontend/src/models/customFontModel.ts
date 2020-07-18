import {action, persist} from "easy-peasy";
import {CustomFontModel} from "~/typings/models";

const customFontModel: CustomFontModel = persist({
  fontDelta: 0,

  onFontDeltaUp: action((state, value) => {
    state.fontDelta += 0.5;
  }),

  onFontDeltaDown: action((state, value) => {
    state.fontDelta -= 0.5;
  }),
}, {
  storage: 'localStorage'
});

export default customFontModel;
