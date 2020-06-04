import axios from "axios";
import { returnErrors, createMessage } from "./messages";

import { ADD_BANK, GET_BANK, MAKE_WITHDRAWAL } from "./types";
import { tokenConfig } from "./auth";

//ADD BANK
export const addBank = body => (dispatch, getState) => {
  axios
    .post("/api/user/banks", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_BANK,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET LINKED BANK
export const getLinkedBank = () => (dispatch, getState) => {
  axios
    .get("/api/user/banks", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_BANK,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//WITHDRAW TO BANK
export const makeWithdraw = body => (dispatch, getState) => {
  axios
    .post("/api/user/bank/withdraw", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ makeWithdraw: "Withdrawal Successful" }));
      dispatch({
        type: MAKE_WITHDRAWAL,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
