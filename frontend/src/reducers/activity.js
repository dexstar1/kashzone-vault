import { GET_ACTIVITY } from "../actions/types.js";

const initialState = {
  activity: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ACTIVITY:
      return {
        ...state,
        activity: action.payload
      };
    default:
      return state;
  }
}
