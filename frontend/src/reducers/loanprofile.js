import { VERIFY_ACCOUNT, R_LOAN } from "../actions/types";

const initialState = {
  verifyaccount: [],
  rloan: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case VERIFY_ACCOUNT:
      return {
        ...state,
        verifyaccount: [...state.verifyaccount, action.payload]
      };

    case R_LOAN:
      return {
        ...state,
        rloan: [...state.rloan, action.payload]
      };
    default:
      return state;
  }
}
