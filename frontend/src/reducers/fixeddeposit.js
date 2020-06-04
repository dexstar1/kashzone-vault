import { ADD_FIXED, GET_FIXEDS, INIT_DR_FIXED } from "../actions/types";

const initialState = {
  fixeddeposit: [],
  initdebit: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_FIXED:
      return {
        ...state,
        fixeddeposit: [...state.fixeddeposit, action.payload]
      };
    case GET_FIXEDS:
      return {
        ...state,
        fixeddeposit: action.payload
      };
    case INIT_DR_FIXED:
      return {
        ...state,
        initdebit: [...state.initdebit, action.payload]
      };
    default:
      return state;
  }
}
