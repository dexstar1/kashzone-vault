import { GET_BALANCE } from "../actions/types";

const intialState = {
  wallet: []
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        ...state,
        wallet: [...state.wallet, action.payload]
      };
    default:
      return state;
  }
}
