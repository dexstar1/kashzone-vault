import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import {
  ADD_LITTLED,
  GET_LITTLED,
  LITTLE_WITHDRAW,
  LITTLE_DROP
} from "./types";

//ADD LITTLED
export const addLittleD = quantum => (dispatch, getState) => {
  axios
    .post("/api/product/littledrops/", quantum, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({
          addLittleD: "Bucket Created"
        })
      );
      dispatch({
        type: ADD_LITTLED,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PLANS
export const getLittleD = () => (dispatch, getState) => {
  axios
    .get("/api/product/littledrops", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_LITTLED,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//WITHDRAW
export const littleWithdraw = body => (dispatch, getState) => {
  axios
    .post("/api/product/littled/withdraw", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LITTLE_WITHDRAW,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD DROP/ DEPOSIT
export const littleDrop = body => (dispatch, getState) => {
  axios
    .post("/api/product/littled/drop", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LITTLE_DROP,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
