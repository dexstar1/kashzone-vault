import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { addCard, addToken, postOTP } from "../../actions/cards";
import Spinner from "react-bootstrap/Spinner";

export class WelcomeCardDetails extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      cardname: "",
      cardno: "",
      expirymonth: "",
      expiryyear: "",
      cvv: "",
      pin: "",
      otp: "",
      iframeUrl: "",
      referenceCode: "",
      cardnamehelperText: false,
      cardnohelperText: false,
      expiryhelperText: false,
      cvvhelperText: false,
      pinhelperText: false,
      otphelperText: false,
      hideSpinner: true,
      hideSpinner2: true,
      hideSpinner3: true,
      disableButton: false,
      disableButton2: false,
      disableButton3: false
    };
  }

  static propTypes = {
    addCard: PropTypes.func.isRequired,
    postOTP: PropTypes.func.isRequired,
    addToken: PropTypes.func.isRequired
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value, [input + "helperText"]: "" });
  };

  continue = () => {
    if (
      this.state.cardname == "" ||
      this.state.cardno == "" ||
      this.state.expirymonth == "" ||
      this.state.expiryyear == "" ||
      this.state.cvv == ""
    ) {
      if (this.state.cardname == "") {
        this.setState({ cardnamehelperText: true });
      } else if (this.state.cardno == "") {
        this.setState({ cardnohelperText: true });
      } else if (this.state.expiryyear == "" || this.state.expirymonth == "") {
        this.setState({ expiryhelperText: true });
      } else if (this.state.cvv == "") {
        this.setState({ cvvhelperText: true });
      }
    } else {
      const {
        cardname,
        cardno,
        cvv,
        expirymonth,
        expiryyear,
        pin
      } = this.state;
      const card = { cardname, cardno, cvv, expirymonth, expiryyear, pin };
      this.setState({
        disableButton: true,
        hideSpinner: false
      });
      this.props.addCard(card);
    }
  };

  continue2 = () => {
    if (this.state.pin == "") {
      this.setState({ pinhelperText: true });
    } else {
      const {
        cardname,
        cardno,
        cvv,
        expirymonth,
        expiryyear,
        pin
      } = this.state;
      const card = { cardname, cardno, cvv, expirymonth, expiryyear, pin };
      this.setState({
        hideSpinner2: false,
        disableButton2: true
      });
      this.props.addCard(card);
    }
  };

  continue3 = () => {
    if (this.state.otp == "") {
      this.setState({ otphelperText: true });
    } else {
      const { otp, cardno, expirymonth, expiryyear } = this.state;
      const transref = this.props.responseAction.Ref;
      const body = { otp, transref, cardno, expirymonth, expiryyear };
      this.props.postOTP(body);

      this.setState({
        hideSpinner3: false,
        disableButton3: true
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.responseAction.response !== prevProps.responseAction.response
    ) {
      if (this.props.responseAction.response === "Enter Pin") {
        this.setState({
          step: 2,
          hiddenSpinner: true
        });
      }
      if (this.props.responseAction.response === true) {
        this.setState({
          step: 3,
          hideSpinner2: true
        });
      }
      if (this.props.responseAction.response === "authUrl") {
        console.log("its Url");
        let url = this.props.responseAction.url;
        let referenceRef = this.props.responseAction.txRef;
        this.setState({
          step: 4,
          hiddenSpinner: true,
          iframeUrl: url,
          referenceCode: referenceRef
        });
      }
    }
    if (this.props.otpResponse.status !== prevProps.otpResponse.status) {
      if (this.props.otpResponse.status === "success") {
        this.setState({
          hiddenSpinner3: true,
          cardname: "",
          cardno: "",
          expirymonth: "",
          expiryyear: "",
          cvv: "",
          pin: "",
          otp: ""
        });
      }
    }

    if (this.props.refMessage.status !== prevProps.refMessage.status) {
      if (this.props.refMessage.status === "success") {
        this.setState({
          cardname: "",
          cardno: "",
          expirymonth: "",
          expiryyear: "",
          cvv: "",
          pin: "",
          otp: ""
        });
      }
      if (this.props.refMessage.status === "failed") {
        this.setState({
          step: 1,
          cardname: "",
          cardno: "",
          expirymonth: "",
          expiryyear: "",
          cvv: "",
          pin: "",
          otp: ""
        });
      }
    }
  }

  render() {
    if (this.props.otpResponse.status === "success") {
      return <Redirect to="/welcome/addbank" />;
    }
    const { step } = this.state;
    switch (step) {
      case 1:
        return (
          <Fragment>
            <div className="text-center welcome-card-action">
              <h1>Debit/ATM Card.</h1>

              <h5>Add card progress: 20%</h5>
              <br />
              <article className="card wc-card shadow">
                <div className="card-body p-5">
                  <form role="form">
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FontAwesomeIcon icon={faUser} />
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name on Card"
                          onChange={this.handleChange("cardname")}
                          defaultValue={this.state.cardname}
                        />
                      </div>
                      <div hidden={!this.state.cardnamehelperText}>
                        <p className="text-danger text-xs">
                          Enter name on card
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FontAwesomeIcon icon={faCreditCard} />
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="0000 0000 0000 0000"
                          defaultValue={this.state.cardno}
                          onChange={this.handleChange("cardno")}
                        />
                      </div>
                      <div hidden={!this.state.cardnohelperText}>
                        <p className="text-danger text-xs">
                          Input a valid card number
                        </p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-8">
                        <div className="form-group">
                          <label>
                            <span className="hidden-xs">Expiration</span>{" "}
                          </label>
                          <div className="form-inline">
                            <select
                              className="form-control"
                              style={{ width: "45%" }}
                              value={this.state.expirymonth}
                              onChange={this.handleChange("expirymonth")}
                            >
                              <option value="">MM</option>
                              <option value="01">01 - JAN</option>
                              <option value="02">02 - FEB</option>
                              <option value="03">03 - MAR</option>
                              <option value="04">04 - APR</option>
                              <option value="05">05 - MAY</option>
                              <option value="06">06 - JUN</option>
                              <option value="07">07 - JUL</option>
                              <option value="08">08 - AUG</option>
                              <option value="09">09 - SEP</option>
                              <option value="10">10 - OCT</option>
                              <option value="11">11 - NOV</option>
                              <option value="12">12 - DEC</option>
                            </select>
                            <span style={{ width: "10%", textAlign: "center" }}>
                              {" "}
                              /{" "}
                            </span>
                            <select
                              className="form-control"
                              style={{ width: "45%" }}
                              value={this.state.expiryyear}
                              onChange={this.handleChange("expiryyear")}
                            >
                              <option value="">YY</option>
                              <option value="2019">2019</option>
                              <option value="2020">2020</option>
                              <option value="2021">2021</option>
                              <option value="2022">2022</option>
                              <option value="2023">2023</option>
                              <option value="2024">2024</option>
                              <option value="2025">2025</option>
                            </select>
                            <div hidden={!this.state.expiryhelperText}>
                              <p className="text-danger text-xs">
                                Select card expiry data
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label
                            data-toggle="tooltip"
                            title=""
                            data-original-title="3 digits code on back side of the card"
                          >
                            CVV{" "}
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              style={{ color: "black", paddingLeft: "1px" }}
                            />
                          </label>
                          <input
                            className="form-control"
                            required
                            defaultValue={this.state.cvv}
                            onChange={this.handleChange("cvv")}
                            type="text"
                            maxLength="4"
                          />
                          <div hidden={!this.state.cvvhelperText}>
                            <p className="text-danger text-xs">Input cvv</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => this.continue()}
                      className="subscribe btn btn-primary btn-block"
                      type="button"
                      disabled={this.state.disableButton}
                    >
                      <span hidden={this.state.hideSpinner}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </span>{" "}
                      Confirm
                    </button>
                  </form>
                </div>
              </article>
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
      case 2:
        return (
          <Fragment>
            <div className="text-center welcome-card-action">
              <h1>Debit/ATM Card.</h1>

              <h5>Add card progress: 70%</h5>
              <br />
              <article className="card wc-card shadow">
                <div className="card-body p-5">
                  <form role="form">
                    <div className="form-group">
                      <label style={{ color: "#dd4f05" }}>
                        <strong>Enter Debit card pin</strong>
                      </label>

                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          required
                          defaultValue={this.state.pin}
                          onChange={this.handleChange("pin")}
                          maxLength="4"
                        />
                      </div>
                      <div hidden={!this.state.pinhelperText}>
                        <p className="text-danger text-xs">Input needed</p>
                      </div>
                    </div>
                    <button
                      onClick={() => this.continue2()}
                      className="subscribe btn btn-primary btn-block"
                      type="button"
                      disabled={this.state.disableButton2}
                    >
                      <span hidden={this.state.hideSpinner2}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </span>{" "}
                      Proceed
                    </button>
                  </form>
                </div>
              </article>
            </div>
          </Fragment>
        );

      case 3:
        return (
          <Fragment>
            <div className="text-center welcome-card-action">
              <h1>Debit/ATM Card.</h1>

              <h5>Add card progress: 95%</h5>
              <br />
              <article className="card wc-card shadow">
                <div className="card-body p-5">
                  <form role="form">
                    <div className="form-group">
                      <label style={{ color: "#dd4f05" }}>
                        <strong>
                          {this.props.responseAction.chargemessage}
                        </strong>
                      </label>

                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          required
                          defaultValue={this.state.otp}
                          onChange={this.handleChange("otp")}
                        />
                      </div>
                      <div hidden={!this.state.otphelperText}>
                        <p className="text-danger text-xs">Input needed</p>
                      </div>
                    </div>
                    <button
                      className="subscribe btn btn-primary btn-block"
                      type="button"
                      disabled={this.state.disableButton3}
                      onClick={() => this.continue3()}
                    >
                      <span hidden={this.state.hideSpinner3}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </span>{" "}
                      Complete
                    </button>
                  </form>
                </div>
              </article>
            </div>
          </Fragment>
        );
    }
  }
}

const mapStateToProps = state => ({
  responseAction: state.cards.cards,
  refMessage: state.cards.ref,
  otpResponse: state.cards.otp
});

export default connect(
  mapStateToProps,
  { addCard, addToken, postOTP }
)(WelcomeCardDetails);
