import axios from "axios";
import { returnErrors } from "./messages";

import { tokenConfig } from "./auth";

import { GET_ACTIVITY } from "./types";

// GET ACTIVITY
export const getActivity = () => (dispatch, getState) => {
  axios
    .get("/api/wallet/actions", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ACTIVITY,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
