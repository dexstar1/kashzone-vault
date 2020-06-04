import axios from "axios";
import { returnErrors, createMessage } from "./messages";

import { GET_BALANCE } from "./types";
import { tokenConfig } from "./auth";

//GET LINKED CARDS
export const getWalletState = () => (dispatch, getState) => {
  axios
    .get("/api/wallet", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_BALANCE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
