import { combineReducers } from "redux";

import activity from "./activity";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import cards from "./cards";
import regvalidate from "./regvalidate";
import loanprofile from "./loanprofile";
import applications from "./applications";
import deposit from "./deposit";
import wallet from "./wallet";
import rentplus from "./rentplus";
import targetsavings from "./targetsavings";
import fixeddeposit from "./fixeddeposit";
import banks from "./banks";
import transfers from "./transfers";
import littledrops from "./littledrops";
import accountcontrol from "./accountcontrol";

export default combineReducers({
  activity,
  errors,
  messages,
  auth,
  cards,
  regvalidate,
  loanprofile,
  applications,
  deposit,
  wallet,
  rentplus,
  targetsavings,
  fixeddeposit,
  banks,
  transfers,
  littledrops,
  accountcontrol
});
