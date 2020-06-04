import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import { tokenConfig } from "./auth";
import { SMART_TRANSFER, VERIFY_VAULT } from "./types";

//INITIATE TRANSFER
export const makeTransfer = body => (dispatch, getState) => {
  axios
    .post("/api/user/fund/transfer", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ makeTransfer: "Transfer successful" }));
      dispatch({
        type: SMART_TRANSFER,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//VERIFY VAULT ACCOUNT
/**
 * Works similarly to VERIFY ACCOUNT for Banks
 * This verifies the vault wallet destination for sending fund is valid
 *
 */
export const verifyVault = wallet_id => (dispatch, getState) => {
  axios
    .post(
      "/api/user/fund/recipient/verify",
      { phone_number: wallet_id },
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: VERIFY_VAULT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
