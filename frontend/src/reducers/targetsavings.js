import { ADD_TARGET, GET_TARGETS, INIT_DR_TARGET } from "../actions/types";

const initialState = {
  targetsavings: [],
  initdebit: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TARGET:
      return {
        ...state,
        targetsavings: [...state.targetsavings, action.payload]
      };
    case GET_TARGETS:
      return {
        ...state,
        targetsavings: action.payload
      };
    case INIT_DR_TARGET:
      return {
        ...state,
        initdebit: [...state.initdebit, action.payload]
      };
    default:
      return state;
  }
}
