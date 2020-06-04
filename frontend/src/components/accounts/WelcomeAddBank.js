import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

var Mastercard = require("../../assets/mastercard.png");
var Visa = require("../../assets/visa.png");
var Verve = require("../../assets/verved.png");
var FLW = require("../../assets/FLW-logo.png");

export class WelcomeAddBank extends Component {
  render() {
    return (
      <Fragment>
        <div className="text-center card-action">
          <h1>Welldone! Link your Bank.</h1>
          <br />
          <h5>
            Lets make things faster when you want to transfer/withdraw fund.
          </h5>
          <br />
          <br />

          <Link
            style={{ textDecoration: "none" }}
            className="add-card"
            to="/welcome/processbank"
          >
            <span className="add-ctext">Link Bank Now</span>
          </Link>
          <br />
          <br />
          <h6>
            Any difficulties linking your bank? please <a>contact us</a> here
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

export default WelcomeAddBank;
