import axios from "axios";
import { returnErrors, createMessage } from "./messages";

import { ADD_CARD, POST_OTP, GET_CARDS, ADD_CARD_TOKEN } from "./types";
import { tokenConfig } from "./auth";

//ADD CARD
export const addCard = card => (dispatch, getState) => {
  axios
    .post("/api/user/addcard", card, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_CARD,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//POST OTP
export const postOTP = body => (dispatch, getState) => {
  axios
    .post("/api/user/card/otp", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: POST_OTP,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET LINKED CARDS
export const getLinkedCards = () => (dispatch, getState) => {
  axios
    .get("/api/user/cards", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_CARDS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//VERIFY & ADD CARD VISA CARDS
export const addToken = (ref, cnoit, monit, type) => (dispatch, getState) => {
  axios
    .post(
      "/api/user/card/verify",
      { txref: ref, card_number: cnoit, expiry_date: monit, card_type: type },
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(createMessage({ addToken: "Card Linked" }));
      dispatch({
        type: ADD_CARD_TOKEN,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
