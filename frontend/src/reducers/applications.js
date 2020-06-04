import {
  ADD_LOAN,
  GET_LOANS,
  RESOLVE_LOAN,
  REPAY_LOAN
} from "../actions/types";

const initialState = {
  loans: [],
  resolve: [],
  repay: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_LOAN:
      return {
        ...state,
        loans: [...state.loans, action.payload]
      };
    case GET_LOANS:
      return {
        ...state,
        loans: action.payload
      };
    case RESOLVE_LOAN:
      return {
        ...state,
        resolve: [...state.resolve, action.payload]
      };
    case REPAY_LOAN:
      return {
        ...state,
        repay: [...state.repay, action.payload]
      };
    default:
      return state;
  }
}
