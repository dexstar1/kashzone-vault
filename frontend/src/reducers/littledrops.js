import {
  ADD_LITTLED,
  GET_LITTLED,
  LITTLE_WITHDRAW,
  LITTLE_DROP
} from "../actions/types";

const initialState = {
  littledrops: [],
  deposit: [],
  withdraw: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_LITTLED:
      return {
        ...state,
        littledrops: [...state.littledrops, action.payload]
      };
    case GET_LITTLED:
      return {
        ...state,
        littledrops: action.payload
      };
    case LITTLE_WITHDRAW:
      return {
        ...state,
        withdraw: [...state.littledrops, action.payload]
      };
    case LITTLE_DROP:
      return {
        ...state,
        deposit: [...state.deposit, action.payload]
      };
    default:
      return state;
  }
}
