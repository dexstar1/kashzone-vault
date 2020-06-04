import {
  ADD_CARD,
  POST_OTP,
  ADD_CARD_TOKEN,
  GET_CARDS
} from "../actions/types";

const initialState = {
  cards: [],
  otp: [],
  linkedcards: [],
  ref: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_CARD:
      return {
        ...state,
        cards: action.payload
      };
    case POST_OTP:
      return {
        ...state,
        otp: action.payload
      };

    case ADD_CARD_TOKEN:
      return {
        ...state,
        ref: action.payload
      };

    case GET_CARDS:
      return {
        ...state,
        linkedcards: action.payload
      };

    default:
      return state;
  }
}
