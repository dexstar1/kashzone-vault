import {
  POST_EMAIL,
  POST_AUTH,
  POST_PHONENUMBER,
  POST_PROFILE,
  GET_PROFILE
} from "../actions/types";

const initialState = {
  phone_number: [],
  email: [],
  eauth: [],
  profile: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case POST_PHONENUMBER:
      return {
        ...state,
        phone_number: [...state.phone_number, action.payload]
      };
    case POST_EMAIL:
      return {
        ...state,
        email: [...state.email, action.payload]
      };
    case POST_AUTH:
      return {
        ...state,
        eauth: [...state.eauth, action.payload]
      };
    case POST_PROFILE:
      return {
        ...state,
        profile: [...state.profile, action.payload]
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: [...state.profile, action.payload]
      };
    default:
      return state;
  }
}
