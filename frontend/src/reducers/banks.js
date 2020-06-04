import { ADD_BANK, GET_BANK, MAKE_WITHDRAWAL } from "../actions/types";

const initialState = {
  banks: [],
  withdraw: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_BANK:
      return {
        ...state,
        banks: action.payload
      };
    case GET_BANK:
      return {
        ...state,
        banks: action.payload
      };
    case MAKE_WITHDRAWAL:
      return {
        ...state,
        withdraw: [...state.withdraw, action.payload]
      };
    default:
      return state;
  }
}
