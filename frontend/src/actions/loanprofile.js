import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import { VERIFY_ACCOUNT, R_LOAN } from "./types";

//VERIFY ACCOUNT
export const verifyAccount = (bankName, bankAccount) => (
  dispatch,
  getState
) => {
  const body = JSON.stringify({ bankName, bankAccount });

  axios
    .post("/api/loan/bank/validate", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ verifyAccount: "Account Validated" }));
      dispatch({
        type: VERIFY_ACCOUNT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET MAX REQUESTABLE AMOUNT
export const rLoan = () => (dispatch, getState) => {
  axios
    .get("/api/loan/getvalue", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: R_LOAN,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
