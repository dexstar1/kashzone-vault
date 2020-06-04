import { ALL_PLANS, LIQUIDATE_PLAN } from "../actions/types";

const initialState = {
  plans: [],
  liquidate: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ALL_PLANS:
      return {
        ...state,
        plans: [...state.plans, action.payload]
      };
    case LIQUIDATE_PLAN:
      return {
        ...state,
        liquidate: [...state.liquidate, action.payload]
      };
    default:
      return state;
  }
}
