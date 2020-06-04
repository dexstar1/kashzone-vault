import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import { ADD_TARGET, GET_TARGETS, INIT_DR_TARGET } from "./types";

//ADD PLAN
export const addTargetS = body => (dispatch, getState) => {
  axios
    .post("/api/product/targetsavings/", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addTargetS: "Plan Created" }));
      dispatch({
        type: ADD_TARGET,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PLANS
export const getTargetS = () => (dispatch, getState) => {
  axios
    .get("/api/product/targetsavings", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TARGETS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//TRY INITIAL DEBIT
export const contribTargetS = body => (dispatch, getState) => {
  axios
    .post("/api/product/targetsavings/new/charge", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: INIT_DR_TARGET,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
