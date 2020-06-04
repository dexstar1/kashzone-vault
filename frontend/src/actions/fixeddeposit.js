import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import { ADD_FIXED, GET_FIXEDS, INIT_DR_FIXED } from "./types";

//ADD PLAN
export const addFixds = body => (dispatch, getState) => {
  axios
    .post("/api/product/fixds/", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addFixds: "Plan Created" }));
      dispatch({
        type: ADD_FIXED,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PLANS
export const getFixds = () => (dispatch, getState) => {
  axios
    .get("/api/product/fixds", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_FIXEDS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//TRY INITIAL DEBIT
export const depositFixds = body => (dispatch, getState) => {
  axios
    .post("/api/product/fixds/new/charge", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: INIT_DR_FIXED,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
