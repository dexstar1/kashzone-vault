import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { addLoan, getLoans } from "../../actions/applications";
import { rLoan } from "../../actions/loanprofile";
import { getLinkedCards } from "../../actions/cards";
import CircularProgress from "@material-ui/core/CircularProgress";

export class LoanChoiceChild extends Component {
  constructor() {
    super();
    this.state = {
      activeLoan: true,
      cardPresent: false,
      loanable: null,
      checkers: false,
      hiddenSpinner: true,
      valueA: "",
      valueB: "",
      valueC: "",
      loanAmount: "",
      loanPeriod: "0",
      interestRate: "",
      repaymentAmount: "",
      startDate: "",
      endDate: "",
      color: "#fdf7f9",
      color2: "#fdf7f9",
      color3: "#fdf7f9",
      hidden: true,
      timecolor: "#fdf7f9",
      timecolor2: "#fdf7f9",
      timecolor3: "#fdf7f9",
      timecolor4: "#fdf7f9",

      hidden2: true,
      disableButton: true
    };
    //
    this.getRepayment = this.getRepayment.bind(this);
  }
  static propTypes = {
    addLoan: PropTypes.func.isRequired,
    getLinkedCards: PropTypes.func.isRequired,
    getLoans: PropTypes.func.isRequired,
    rLoan: PropTypes.func.isRequired
  };

  continue = () => {
    this.props.addLoan(this.state.loanAmount, this.state.loanPeriod, this.state.interestRate, this.state.repaymentAmount, this.state.startDate, this.state.endDate);
    this.props.nextStep();
  };
  getRepayment = () => {
    const value = parseInt(this.state.loanAmount) * (parseInt(this.state.interestRate) / 100) + parseInt(this.state.loanAmount);
    //force
    this.state.repaymentAmount = value;
    return value;
  };
  getDate = days => {
    let current_date = new Date();
    let date = current_date.getDate();
    let startdateValueISO = current_date.toISOString();
    let startdateValueString = current_date.toDateString();
    let endDate = current_date.setDate(date + parseInt(days));
    let endDateValueISO = current_date.toISOString();
    let endDateValueString = current_date.toDateString();

    //force
    this.state.endDate = endDateValueISO;
    this.state.startDate = startdateValueISO;

    return endDateValueString;
  };

  componentDidMount() {
    this.props.getLoans();
    this.props.getLinkedCards();
    this.props.rLoan();
    this.setState({
      hiddenSpinner: false
    });
  }

  componentDidUpdate(prevProps) {
    const { linkedcards, requestable, applications } = this.props;
    const response = { applications };

    if (this.props.applications !== prevProps.applications) {
      if (this.props.applications.length > 0) {
        if (applications[0]) {
          if ((response.applications[0].status === "settled" || response.applications[0].status === "failed") && response.applications[0].repayment_even === true) {
            this.setState({
              activeLoan: false
            });
          }
        }
      }
    }

    if (this.props.requestable !== prevProps.requestable) {
      if (this.props.requestable[0]) {
        let givenValue = requestable[0].requestable;
        if (givenValue >= 2000) {
          this.setState({
            loanable: true,
            hiddenSpinner: true,
            valueA: givenValue,
            valueB: givenValue * 0.75,
            valueC: givenValue * 0.3
          });
        } else {
          this.setState({
            loanable: false,
            hiddenSpinner: true
          });
        }
      }
    }

    if (this.props.linkedcards !== prevProps.linkedcards) {
      if (this.props.linkedcards.length >= 1) {
        this.setState({
          cardPresent: true
        });
      }
    }
  }

  handleClick = colortype => {
    if (colortype === "color") {
      this.setState({
        loanAmount: this.state.valueA,
        color: "#f9c7d8",
        color2: "#fdf7f9",
        color3: "#fdf7f9"
      });
    } else if (colortype === "color2") {
      this.setState({
        loanAmount: this.state.valueB,
        color2: "#f9c7d8",
        color: "#fdf7f9",
        color3: "#fdf7f9"
      });
    } else if (colortype === "color3") {
      this.setState({
        loanAmount: this.state.valueC,
        color3: "#f9c7d8",
        color: "#fdf7f9",
        color2: "#fdf7f9"
      });
    }

    this.setState({
      hidden: false
    });
  };

  handleClick2 = colortype => {
    if (colortype === "timecolor") {
      this.setState({
        loanPeriod: 90,
        interestRate: 4.0,
        timecolor: "#f9c7d8",
        timecolor2: "#fdf7f9",
        timecolor3: "#fdf7f9",
        timecolor4: "#fdf7f9"
      });
    } else if (colortype === "timecolor2") {
      this.setState({
        loanPeriod: 60,
        interestRate: 3.5,
        timecolor2: "#f9c7d8",
        timecolor: "#fdf7f9",
        timecolor3: "#fdf7f9",
        timecolor4: "#fdf7f9"
      });
    } else if (colortype === "timecolor3") {
      this.setState({
        loanPeriod: 30,
        interestRate: 2.0,
        timecolor3: "#f9c7d8",
        timecolor: "#fdf7f9",
        timecolor2: "#fdf7f9",
        timecolor4: "#fdf7f9"
      });
    } else if (colortype === "timecolor4") {
      this.setState({
        loanPeriod: 15,
        interestRate: 2.0,
        timecolor4: "#f9c7d8",
        timecolor: "#fdf7f9",
        timecolor2: "#fdf7f9",
        timecolor3: "#fdf7f9"
      });
    }
    this.setState({
      hidden2: false
    });
  };

  returnButtons = () => {
    return (
      <div>
        <Button variant="contained" component="span" className="button" style={{ marginRight: "10px" }} onClick={this.continue}>
          Request loan
        </Button>
        <Button variant="contained" component="span" className="button">
          Cancel
        </Button>
      </div>
    );
  };

  returnLoanChoice = () => {
    return (
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
          title="Loan Choice"
        />
        <br />
        <div>
          <h5>
            Select your loan amount <br />
            <small>select loan amount from offer below</small>
          </h5>
          <br />

          <button
            style={{
              backgroundColor: this.state.color,
              border: "none",
              color: "#2d292a",
              //padding: "50px 50px",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "10px",
              outline: "none"
            }}
            onClick={() => this.handleClick("color")}
            className="shadow"
          >
            ₦{this.state.valueA}
          </button>

          <button
            style={{
              backgroundColor: this.state.color2,
              border: "none",
              color: "#2d292a",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "10px",
              outline: "none"
            }}
            onClick={() => this.handleClick("color2")}
            className="shadow"
          >
            ₦{this.state.valueB}
          </button>

          <button
            style={{
              backgroundColor: this.state.color3,
              border: "none",
              color: "#2d292a",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              outline: "none"
            }}
            onClick={() => this.handleClick("color3")}
            className="shadow"
          >
            ₦{this.state.valueC}
          </button>
        </div>
        <br />
        <br />
        <div hidden={this.state.hidden}>
          <h5>Select your loan period</h5>

          <button
            style={{
              backgroundColor: this.state.timecolor,
              border: "none",
              color: "#2d292a",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              outline: "none",
              marginRight: "10px"
            }}
            onClick={() => this.handleClick2("timecolor")}
            className="shadow"
          >
            90 days
          </button>
          <button
            style={{
              backgroundColor: this.state.timecolor2,
              border: "none",
              color: "#2d292a",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              outline: "none",
              marginRight: "10px"
            }}
            onClick={() => this.handleClick2("timecolor2")}
            className="shadow"
          >
            60 days
          </button>
          <button
            style={{
              backgroundColor: this.state.timecolor3,
              border: "none",
              color: "#2d292a",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              outline: "none",
              marginRight: "10px"
            }}
            onClick={() => this.handleClick2("timecolor3")}
            className="shadow"
          >
            30 days
          </button>
          <button
            style={{
              backgroundColor: this.state.timecolor4,
              border: "none",
              color: "#2d292a",
              width: "100px",
              height: "100px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "16px",
              borderRadius: "50%",
              display: "inline-block",
              outline: "none",
              marginRight: "10px"
            }}
            onClick={() => this.handleClick2("timecolor4")}
            className="shadow"
          >
            15 days
          </button>
        </div>
        <br />
        <br />
        <div hidden={this.state.hidden2} className="shadow">
          <Card className="title">
            <CardContent>
              <h5 style={{ textAlign: "center" }}>Loan Details</h5>
              <table border="0" style={{ margin: "0 auto" }}>
                <tbody>
                  <tr>
                    <th>Loan Amount:</th>
                    <td>₦{this.state.loanAmount}</td>
                  </tr>
                  <tr>
                    <th>Interest rate:</th>
                    <td>{this.state.interestRate}%</td>
                  </tr>
                  <tr>
                    <th>Repayment amount:</th>
                    <td>₦{this.getRepayment()}</td>
                  </tr>
                  <tr>
                    <th>Repayment date:</th>
                    <td>{this.getDate(this.state.loanPeriod)}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              {!this.state.cardPresent ? this.returnMessage2() : this.returnButtons()}
            </CardContent>
          </Card>
        </div>
      </React.Fragment>
    );
  };

  returnMessage = () => {
    if (this.state.loanable === false && this.state.cardPresent === false) {
      return (
        <React.Fragment>
          <div>
            <br />
            <br />
            <h5>
              <strong>
                (A) You currently don't have access to our loan support. Vault loan support is aimed at customers with speculative savings goal(s). Save more to access our loans.
              </strong>
              <br />
              <strong>(B) Processing a loan requires adding a Debit Card. Please proceed to adding your debit card before a requesting loan</strong>
            </h5>
            <br />
            <br />
          </div>
        </React.Fragment>
      );
    }
    if (this.state.loanable === false || this.state.cardPresent === false) {
      if (this.state.loanable === false) {
        return (
          <React.Fragment>
            <div>
              <br />
              <br />
              <h5>
                <strong>
                  You currently don't have access to our loan support. Vault loan support is aimed at customers with speculative savings goal(s). Save more to access our loans.
                </strong>
              </h5>
              <br />
              <br />
            </div>
          </React.Fragment>
        );
      }
    } else if (this.state.cardPresent === false) {
      return (
        <React.Fragment>
          <div>
            <h5>
              <strong>Processing a loan requires adding a Debit Card. Please proceed to adding your debit card before a requesting loan</strong>
            </h5>
          </div>
        </React.Fragment>
      );
    }
  };
  returnMessage2 = () => {
    return (
      <React.Fragment>
        <div>
          <h5>
            <strong>You Currently have an outstanding loan, Kindly settle your last loan request in order to access a new loan</strong>
          </h5>
        </div>
      </React.Fragment>
    );
  };
  render() {
    return (
      <MuiThemeProvider>
        <div className="card p-1 shadow p-4 mb-4 bg-white">
          <div className="col-sm-7 offset-sm-2 text-center">
            <CircularProgress hidden={this.state.hiddenSpinner} disableShrink />
            {this.state.activeLoan ? this.returnLoanChoice() : this.returnMessage2()}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  applications: state.applications.loans,
  requestable: state.loanprofile.rloan,
  linkedcards: state.cards.linkedcards
});

export default connect(mapStateToProps, { addLoan, getLoans, getLinkedCards, rLoan })(LoanChoiceChild);
