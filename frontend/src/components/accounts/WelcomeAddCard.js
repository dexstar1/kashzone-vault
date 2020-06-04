import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

var Mastercard = require("../../assets/mastercard.png");
var Visa = require("../../assets/visa.png");
var Verve = require("../../assets/verved.png");
var FLW = require("../../assets/FLW-logo.png");

export class WelcomeAddCard extends Component {
  render() {
    return (
      <Fragment>
        <div className="text-center card-action">
          <h1>Great! Add your Debit/ATM Card.</h1>
          <br />
          <h5>
            To validate your card, Vault will initiate a debit of ₦100 from your
            card now. This amount goes into your vault wallet.
          </h5>
          <br />
          <br />

          <Link className="add-card-link add-card" to="/welcome/processcard">
            <span className="add-ctext">Add card</span>
          </Link>
          <br />
          <br />
          <div>
            <h6 className="secured" style={{ display: "inline" }}>
              Secured by
            </h6>
            <img
              className="custom-logo"
              alt="Flutterwave"
              src={FLW}
              itemProp="logo"
            />
          </div>
          <div className="card card-body card-schemes">
            <div className="schemes">
              <img className="mastercard" src={Mastercard} />
              <img className="visa" src={Visa} />
              <img className="verve" src={Verve} />
            </div>
          </div>
          <br />
          <br />

          <h6>
            Any difficulties adding your card? please <a>contact us</a> here
          </h6>
        </div>

        <footer>
          <b>
            Powered by{" "}
            <a
              className="app-link"
              target="_blank"
              href="http://www.addosser.com/"
            >
              Addoser Microfinance Bank
            </a>
          </b>
        </footer>
      </Fragment>
    );
  }
}

export default WelcomeAddCard;
