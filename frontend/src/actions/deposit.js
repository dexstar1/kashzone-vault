import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import { MAKE_DEPOSIT } from "./types";

//DEPOSIT
export const depositFund = body => (dispatch, getState) => {
  axios
    .post("/api/user/card/charge", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ deposit: "Wallet Credited" }));
      dispatch({
        type: MAKE_DEPOSIT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
