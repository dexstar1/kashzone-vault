import { SMART_TRANSFER, VERIFY_VAULT } from "../actions/types";

const initialState = {
  transfers: [],
  walletverify: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SMART_TRANSFER:
      return {
        ...state,
        transfers: [...state.transfers, action.payload]
      };
    case VERIFY_VAULT:
      return {
        ...state,
        walletverify: [...state.walletverify, action.payload]
      };
    default:
      return state;
  }
}
