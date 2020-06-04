import axios from "axios";
import { tokenConfig } from "./auth";
import { createMessage, returnErrors } from "./messages";

import {
  POST_EMAIL,
  POST_AUTH,
  POST_PHONENUMBER,
  POST_PROFILE,
  GET_PROFILE
} from "./types";

//POST TO VERTIFY UNIQUENESS OF PHONENUMBER
export const postPhone = phone_number => (dispatch, getState) => {
  axios
    .post(
      "/api/phonenumber/verify",
      { phone_number: phone_number },
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: POST_PHONENUMBER,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//POST EMAIL TO GENERATE AUTH CODE
export const postEmail = email => (dispatch, getState) => {
  axios
    .post("/api/email/verify", { email: email }, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ postEmail: "Auth Code Sent" }));
      dispatch({
        type: POST_EMAIL,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//POST AUTH
export const postAuth = (eauth, email) => (dispatch, getState) => {
  axios
    .post(
      "/api/email/authchecker",
      { verify: eauth, email: email },
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(createMessage({ postAuth: "Email Verified" }));
      dispatch({
        type: POST_AUTH,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//POST_PROFILE: MAIN
export const postProfile = (
  email,
  phoneNumber,
  gender,
  incomeRange,
  employmentStatus,
  relationshipStatus,
  birthday
) => (dispatch, getState) => {
  const body = {
    email: email,
    phoneNumber: phoneNumber,
    gender: gender,
    incomeRange: incomeRange,
    employmentStatus: employmentStatus,
    relationshipStatus: relationshipStatus,
    birthday: birthday
  };

  axios
    .post("/api/user/mainprofile/update", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ postProfile: "Profile Updated" }));
      dispatch({
        type: POST_PROFILE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PROFILE
export const getProfile = () => (dispatch, getState) => {
  axios
    .get("/api/user/mainprofile/update", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
