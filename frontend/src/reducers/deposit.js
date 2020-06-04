import { MAKE_DEPOSIT } from "../actions/types";

const intialState = {
  deposit: []
};

export default function(state = intialState, action) {
  switch (action.type) {
    case MAKE_DEPOSIT:
      return {
        ...state,
        deposit: [...state.deposit, action.payload]
      };
    default:
      return state;
  }
}
