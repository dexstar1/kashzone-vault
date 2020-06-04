import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import { tokenConfig } from "./auth";
import { ADD_LOAN, GET_LOANS, RESOLVE_LOAN, REPAY_LOAN } from "./types";

//ADD LOANS
export const addLoan = (
  loanAmount,
  loanPeriod,
  interestRate,
  repaymentAmount,
  startDate,
  endDate
) => (dispatch, getState) => {
  axios
    .post(
      "/api/loan/application/",
      {
        loan_amount: loanAmount,
        loan_period: loanPeriod,
        interest_rate: interestRate,
        repayment_amount: repaymentAmount,
        start_date: startDate,
        due_date: endDate,
        repayment_even: false,
        status: "running"
      },
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(createMessage({ addLoan: "Application Successful" }));
      dispatch({
        type: ADD_LOAN,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const getLoans = () => (dispatch, getState) => {
  axios
    .get("/api/loan/application", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_LOANS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const resolveLoan = body => (dispatch, getState) => {
  axios
    .post("/api/loan/resolve", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ resolveLoan: "Loan Resolved" }));
      dispatch({
        type: RESOLVE_LOAN,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const repayLoan = body => (dispatch, getState) => {
  axios
    .post("/api/loan/repayment/charge", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: REPAY_LOAN,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
