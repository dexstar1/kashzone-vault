import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { Provider as AlertProvider, positions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "./sass/app.scss";

import Header from "./layout/Header";
import Dashboard from "./resource/Dashboard";
import Alerts from "./layout/Alerts";
import Login from "./accounts/Login";
import WelcomeAddCard from "./accounts/WelcomeAddCard";
import WelcomeCardDetails from "./accounts/WelcomeCardDetails";
import WelcomeAddBank from "./accounts/WelcomeAddBank";
import WelcomeBankDetails from "./accounts/WelcomeBankDetails";

import WelcomePlans from "./accounts/WelcomePlans";

import Register from "./accounts/Register";
import PrivateRoute from "./common/PrivateRoute";

import UserAccount from "./resource/UserAccount";
import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";

import LittleDrops from "../components/vaultflex/LittleDrops";
import Rentplus from "../components/vaultflex/Rentplus";
import Target from "../components/vaultflex/Target";
import Fixed from "../components/vaultflex/Fixed";
import Kapital from "../components/vaultflex/Kapital";
import ManageCards from "../components/vaultflex/ManageCards";
import Deposit from "../components/resource/Deposit";
import Sendmoney from "../components/resource/Sendmoney";
import Withdraw from "../components/resource/Withdraw";
import LoanHome from "./resource/LoanHome";
import LoanChoice from "../components/resource/LoanChoice";

//Alert Options
const alertOptions = {
  timeout: 3000,
  position: positions.TOP_RIGHT
};

//Main
class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  //PrivateRoute Welcome Link.. delete this comment when you do/
  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <Header />
              <Alerts />
              <br />
              <div className="container">
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute
                    exact
                    path="/welcome/addcard"
                    component={WelcomeAddCard}
                  />
                  <PrivateRoute
                    exact
                    path="/myaccount"
                    component={UserAccount}
                  />
                  <PrivateRoute
                    exact
                    path="/welcome/processcard"
                    component={WelcomeCardDetails}
                  />
                  <PrivateRoute
                    exact
                    path="/welcome/addbank"
                    component={WelcomeAddBank}
                  />
                  <PrivateRoute
                    exact
                    path="/welcome/processbank"
                    component={WelcomeBankDetails}
                  />

                  <PrivateRoute
                    exact
                    path="/welcome/plans"
                    component={WelcomePlans}
                  />

                  <PrivateRoute
                    exact
                    path="/vault/littledrops"
                    component={LittleDrops}
                  />
                  <PrivateRoute
                    exact
                    path="/vault/rentplus"
                    component={Rentplus}
                  />
                  <PrivateRoute
                    exact
                    path="/vault/targets"
                    component={Target}
                  />
                  <PrivateRoute exact path="/vault/fixed" component={Fixed} />
                  <PrivateRoute
                    exact
                    path="/vault/kapital"
                    component={Kapital}
                  />
                  <PrivateRoute
                    exact
                    path="/vault/managecards"
                    component={ManageCards}
                  />
                  <PrivateRoute exact path="/deposit" component={Deposit} />
                  <PrivateRoute exact path="/sendmoney" component={Sendmoney} />
                  <PrivateRoute exact path="/withdraw" component={Withdraw} />
                  <PrivateRoute exact path="/loan/home" component={LoanHome} />
                  <PrivateRoute
                    exact
                    path="/loans/actionpage"
                    component={LoanChoice}
                  />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
