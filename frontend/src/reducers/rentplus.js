import { ADD_RENTP, GET_RENTP, INIT_DR_RENTP } from "../actions/types";

const initialState = {
  rentplus: [],
  initdebit: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_RENTP:
      return {
        ...state,
        rentplus: [...state.rentplus, action.payload]
      };
    case GET_RENTP:
      return {
        ...state,
        rentplus: action.payload
      };
    case INIT_DR_RENTP:
      return {
        ...state,
        initdebit: [...state.rentplus, action.payload]
      };
    default:
      return state;
  }
}
