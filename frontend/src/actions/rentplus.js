import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import { ADD_RENTP, GET_RENTP, INIT_DR_RENTP } from "./types";

//ADD PLAN
export const addRentP = body => (dispatch, getState) => {
  axios
    .post("/api/product/rentplus/", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addRentP: "Plan Created" }));
      dispatch({
        type: ADD_RENTP,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PLANS
export const getRentP = () => (dispatch, getState) => {
  axios
    .get("/api/product/rentplus", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_RENTP,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//TRY INITIAL DEBIT
export const contribRentP = body => (dispatch, getState) => {
  axios
    .post("/api/product/rentplus/new/charge", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: INIT_DR_RENTP,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
