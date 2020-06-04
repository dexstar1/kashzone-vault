import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Iframe from "react-iframe";
import { Link } from "react-router-dom";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import RaisedButton from "material-ui/RaisedButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TextField as TextF } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { addCard, addToken, postOTP } from "../../../actions/cards";

export class Cards extends Component {
  state = {
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
    hiddenSpinner: true,
    hiddenSpinner2: true,
    hiddenSpinner3: true,
    disableButton: false,
    disableButton2: false,
    disableButton3: false,
    disableButton4: false,
    cardnamehelperText: "",
    cardnohelperText: "",
    expirymonthhelperText: "",
    expiryyearhelperText: "",
    cvvhelperText: "",
    pinhelperText: "",
    otphelperText: ""
  };
  static propTypes = {
    addCard: PropTypes.func.isRequired,
    postOTP: PropTypes.func.isRequired,
    addToken: PropTypes.func.isRequired
  };

  /** static contextType = {
    router: () => true

    <Link
                      style={{ color: "blue", textDecoration: "None" }}
                      to={this.context.router.history.goBack}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        className="button"
                      >
                        Go Back
                      </Button>
                    </Link>
                  </div>
  };
  */

  //proceed
  continue = () => {
    if (
      this.state.cardname == "" ||
      this.state.cardno == "" ||
      this.state.expirymonth == "" ||
      this.state.expiryyear == "" ||
      this.state.cvv == ""
    ) {
      if (this.state.cardname == "") {
        this.setState({ cardnamehelperText: "Input needed" });
      } else if (this.state.cardno == "") {
        this.setState({ cardnohelperText: "Input needed" });
      } else if (this.state.expirymonth == "") {
        this.setState({ expirymonthhelperText: "Select option" });
      } else if (this.state.expiryyear == "") {
        this.setState({ expiryyearhelperText: "Select option" });
      } else if (this.state.cvv == "") {
        this.setState({ cvvhelperText: "Input needed" });
      }
    } else {
      //this.props.nextStep();
      const {
        cardname,
        cardno,
        cvv,
        expirymonth,
        expiryyear,
        pin
      } = this.state;
      const card = { cardname, cardno, cvv, expirymonth, expiryyear, pin };
      this.props.addCard(card);

      this.setState({
        hiddenSpinner: false,
        disableButton: true
      });
      //this.nextStep(2)
    }
  };

  continue2 = () => {
    if (this.state.pin == "") {
      this.setState({ pinhelperText: "Input needed" });
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
      this.props.addCard(card);

      this.setState({
        hiddenSpinner2: false,
        disableButton2: true
      });
    }
  };

  continue3 = () => {
    if (this.state.otp == "") {
      this.setState({ otphelperText: "Input needed" });
    } else {
      const { otp, cardno, expirymonth, expiryyear } = this.state;
      const transref = this.props.responseAction.Ref;
      const body = { otp, transref, cardno, expirymonth, expiryyear };
      this.props.postOTP(body);

      this.setState({
        hiddenSpinner3: false,
        disableButton3: true
      });
    }
  };

  continue4 = () => {
    const { referenceCode } = this.state;
    let cnoit = this.props.responseAction.cnoit;
    let monit = this.props.responseAction.monit;
    let type = this.props.responseAction.type;
    this.setState({
      disableButton4: true
    });
    this.props.addToken(referenceCode, cnoit, monit, type);
  };

  nextStep = value => {
    //const { step } = this.state;
    this.setState({
      step: value
    });
  };
  handleChange = input => e => {
    this.setState({ [input]: e.target.value, [input + "helperText"]: "" });
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
          hiddenSpinner2: true
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
          step: 5,
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
          step: 5,
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
    const { step } = this.state;
    const {
      cardname,
      cardno,
      expirymonth,
      expiryyear,
      cvv,
      pin,
      otp
    } = this.state;

    const values = {
      cardname,
      cardno,
      expirymonth,
      expiryyear,
      cvv,
      pin,
      otp
    };

    switch (step) {
      case 1:
        return (
          <MuiThemeProvider>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <div className="col-sm-7 offset-sm-2 text-center">
                <React.Fragment>
                  <AppBar
                    showMenuIconButton={false}
                    style={{
                      backgroundColor: "#fdf7f9",
                      textAlign: "center"
                    }}
                    titleStyle={{
                      color: "#210f08"
                    }}
                    title="Vault 24 | FlutterWave"
                  />
                  <TextField
                    hintText="Name on Card"
                    floatingLabelText="Name on Card"
                    onChange={this.handleChange("cardname")}
                    defaultValue={values.cardname}
                    errorText={this.state.cardnamehelperText}
                  />
                  <br />
                  <TextField
                    hintText="Card Number"
                    floatingLabelText="Card Number"
                    onChange={this.handleChange("cardno")}
                    defaultValue={values.cardno}
                    maxLength="16"
                    errorText={this.state.cardnohelperText}
                  />
                  <br />
                  <br />
                  <div className="row">
                    <div className="col-sm-7 offset-sm-3 text-center">
                      <div className="form-group">
                        <div className="input-group">
                          <FormControl
                            className="form-control col-sm-5"
                            style={{ marginRight: "10px" }}
                          >
                            <InputLabel>Expiry Month</InputLabel>

                            <Select
                              value={values.expirymonth}
                              onChange={this.handleChange("expirymonth")}
                              error={!!this.state.expirymonthhelperText}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="01">01 - JAN</MenuItem>
                              <MenuItem value="02">02 - FEB</MenuItem>
                              <MenuItem value="03">03 - MAR</MenuItem>
                              <MenuItem value="04">04 - APR</MenuItem>
                              <MenuItem value="05">05 - MAY</MenuItem>
                              <MenuItem value="06">06 - JUN</MenuItem>
                              <MenuItem value="07">07 - JUL</MenuItem>
                              <MenuItem value="08">08 - AUG</MenuItem>
                              <MenuItem value="09">09 - SEP</MenuItem>
                              <MenuItem value="10">10 - OCT</MenuItem>
                              <MenuItem value="11">11 - NOV</MenuItem>
                              <MenuItem value="12">12 - DEC</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl
                            className="form-control col-sm-5"
                            style={{ marginRight: "10px" }}
                          >
                            <InputLabel>Expiry Year</InputLabel>

                            <Select
                              value={values.expiryyear}
                              onChange={this.handleChange("expiryyear")}
                              error={!!this.state.expiryyearhelperText}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="2019">2019</MenuItem>
                              <MenuItem value="2020">2020</MenuItem>
                              <MenuItem value="2021">2021</MenuItem>
                              <MenuItem value="2022">2022</MenuItem>
                              <MenuItem value="2023">2023</MenuItem>
                              <MenuItem value="2024">2024</MenuItem>
                              <MenuItem value="2025">2025</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <TextField
                    hintText="CVV"
                    floatingLabelText="CVV"
                    onChange={this.handleChange("cvv")}
                    defaultValue={values.cvv}
                    maxLength="4"
                    errorText={this.state.cvvhelperText}
                  />
                  <br />
                  <CircularProgress
                    hidden={this.state.hiddenSpinner}
                    disableShrink
                  />

                  <br />
                  <RaisedButton
                    disabled={this.state.disableButton}
                    label="Confirm"
                    primary={true}
                    style={styles.button}
                    onClick={() => this.continue()}
                  />
                </React.Fragment>
              </div>
            </div>
          </MuiThemeProvider>
        );

      case 2:
        return (
          <MuiThemeProvider>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <div className="col-sm-7 offset-sm-2 text-center">
                <React.Fragment>
                  <AppBar
                    showMenuIconButton={false}
                    style={{
                      backgroundColor: "#fdf7f9",
                      textAlign: "center"
                    }}
                    titleStyle={{
                      color: "#210f08"
                    }}
                    title="Card PIN"
                  />
                  <br />
                  <TextF
                    label="Enter Card Pin"
                    onChange={this.handleChange("pin")}
                    error={!!this.state.pinhelperText}
                    defaultValue={values.pin}
                    margin="normal"
                    variant="outlined"
                  />
                  <br />
                  <CircularProgress
                    hidden={this.state.hiddenSpinner2}
                    disableShrink
                  />
                  <br />
                  <RaisedButton
                    disabled={this.state.disableButton2}
                    label="Proceed"
                    primary={true}
                    style={styles.button}
                    onClick={() => this.continue2()}
                  />
                </React.Fragment>
              </div>
            </div>
          </MuiThemeProvider>
        );

      case 3:
        return (
          <MuiThemeProvider>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <div className="col-sm-7 offset-sm-2 text-center">
                <React.Fragment>
                  <AppBar
                    showMenuIconButton={false}
                    style={{
                      backgroundColor: "#fdf7f9",
                      textAlign: "center"
                    }}
                    titleStyle={{
                      color: "#210f08"
                    }}
                    title="Card Verification"
                  />
                  <br />
                  <h3>{this.props.responseAction.chargemessage}</h3>

                  <TextF
                    label="Enter OTP"
                    onChange={this.handleChange("otp")}
                    error={!!this.state.otphelperText}
                    margin="normal"
                    variant="outlined"
                  />
                  <br />
                  <CircularProgress
                    hidden={this.state.hiddenSpinner3}
                    disableShrink
                  />
                  <br />
                  <RaisedButton
                    disabled={this.state.disableButton3}
                    label="Complete"
                    primary={true}
                    style={styles.button}
                    onClick={() => this.continue3()}
                  />
                </React.Fragment>
              </div>
            </div>
          </MuiThemeProvider>
        );
      case 4:
        return (
          <MuiThemeProvider>
            <div className="col-md-6 offset-md-3 text-center">
              <React.Fragment>
                <Iframe
                  url={this.state.iframeUrl}
                  width="450px"
                  height="450px"
                />
                <br />
                <RaisedButton
                  disabled={this.state.disableButton4}
                  label="Click to complete"
                  primary={true}
                  style={styles.clicktocomplete}
                  onClick={() => this.continue4()}
                />
              </React.Fragment>
            </div>
          </MuiThemeProvider>
        );

      case 5:
        return (
          <MuiThemeProvider>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <div className="col-sm-7 offset-sm-2 text-center">
                <React.Fragment>
                  <AppBar
                    showMenuIconButton={false}
                    style={{
                      backgroundColor: "#fdf7f9",
                      textAlign: "center"
                    }}
                    titleStyle={{
                      color: "#210f08"
                    }}
                    title="Success"
                  />
                  <br />
                  <div style={{ paddingTop: "50px" }}>
                    <FontAwesomeIcon size="3x" color="#0e4717" icon={faCheck} />
                    <br />
                    <h2>Your Card has been successfully added</h2>
                    <h4>You may add up to 2 debit/credit cards</h4>
                    <br />
                    <FontAwesomeIcon
                      size="3x"
                      color="#0e4717"
                      icon={faThumbsUp}
                    />

                    <br />
                    <br />

                    <Link
                      style={{ color: "blue", textDecoration: "None" }}
                      to="/"
                    >
                      <Button
                        variant="contained"
                        component="span"
                        className="button"
                      >
                        Go HOME
                      </Button>
                    </Link>
                  </div>
                </React.Fragment>
              </div>
            </div>
          </MuiThemeProvider>
        );
    }
  }
}

const styles = {
  button: {
    margin: 15
  },
  clicktocomplete: {
    marginLeft: "-50px"
  }
};

const mapStateToProps = state => ({
  responseAction: state.cards.cards,
  refMessage: state.cards.ref,
  otpResponse: state.cards.otp
});

export default connect(
  mapStateToProps,
  { addCard, addToken, postOTP }
)(Cards);
