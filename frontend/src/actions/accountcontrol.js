import axios from "axios";
import { createMessage, returnErrors } from "./messages";

import { tokenConfig } from "./auth";
import { ALL_PLANS, LIQUIDATE_PLAN } from "./types";

//GET ALL PLANS
export const getPlans = () => (dispatch, getState) => {
  axios
    .get("/api/user/allplans", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ALL_PLANS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//LIQUIDATE PLAN
export const liquidatePlan = (plan, ref) => (dispath, getState) => {
  axios
    .post(
      "/api/user/allplans",
      { plan_name: plan, ref_number: ref },
      tokenConfig(getState)
    )
    .then(res => {
      dispath(createMessage({ liquidatePlan: "Plan dissolved" }));
      dispath({
        type: LIQUIDATE_PLAN,
        payload: res.data
      });
    })
    .catch(err =>
      dispath(returnErrors(err.response.data, err.response.status))
    );
};
