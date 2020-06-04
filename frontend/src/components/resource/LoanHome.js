import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getLoans, resolveLoan, repayLoan } from "../../actions/applications";
import { depositFund } from "../../actions/deposit";

import CircularProgress from "@material-ui/core/CircularProgress";
import { Badge } from "reactstrap";

export class LoanHome extends Component {
  constructor() {
    super();
    this.state = {
      returningLoanCustomer: false,
      hideSpinner: false,
      disabledButton: false
    };
  }
  static propTypes = {
    getLoans: PropTypes.func.isRequired,
    depositFund: PropTypes.func.isRequired,
    resolveLoan: PropTypes.func.isRequired,
    repayLoan: PropTypes.func.isRequired
  };

  returnLoanHistory = () => {
    const { applications } = this.props;
    const values = { applications };
    //reverse from backend
    const reversed = values.applications;

    const getBadgeColor = {
      settled: "primary",
      running: "secondary",
      default: "danger",
      failed: "danger"
    };
    const BadgeColor = type => {
      return getBadgeColor[type];
    };

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Application date</th>
            <th>Loan Amount</th>
            <th>Repayment Amount</th>
            <th>Tenure</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {reversed.map(loan => (
            <tr key={loan.id}>
              <td>{new Date(loan.start_date).toDateString()}</td>
              <td>₦{loan.loan_amount}.00</td>
              <td>₦{loan.repayment_amount}.00</td>
              <td>{loan.loan_period} days</td>
              <td>
                <Badge color={BadgeColor(loan.status)} pill>
                  {loan.status}
                </Badge>
              </td>
              <td>
                {" "}
                <button
                  hidden={!!loan.repayment_even}
                  className="btn btn-primary btn-sm"
                  disabled={this.state.disabledButton}
                  onClick={() => this.handleClick()}
                >
                  Make repayment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  /**
   * we read props from [0] because a reversed list is returned from server
   */
  handleClick = () => {
    const body = {
      send_fund: true,
      amount: this.props.applications[0].repayment_amount
    };
    this.setState({
      disabledButton: true
    });
    this.props.repayLoan(body);
  };
  componentDidMount() {
    this.props.getLoans();
    if (!this.state.returningLoanCustomer) {
      if (this.props.applications) {
        this.setState({
          hideSpinner: true
        });
      }
    }
  }
  componentDidUpdate(prevProps) {
    const { applications, repay } = this.props;
    const response = { repay };
    if (this.props.applications !== prevProps.applications) {
      if (this.props.applications.length > 0) {
        this.setState({
          hideSpinner: true,
          returningLoanCustomer: true
        });
      }
    }
    if (this.props.repay !== prevProps.repay) {
      if (repay.length !== prevProps.repay.length) {
        if (repay[0]) {
          if (response.repay[0].status === "success") {
            const body = {
              repayment_even: true,
              status: "settled"
            };
            this.props.resolveLoan(body);
          } else {
            this.setState({
              disabledButton: false
            });
          }
        }
      }
    }
    //if(this.props.resolve !== prevProps.resolve)
  }
  render() {
    return (
      <Fragment>
        <div>
          <strong>No current loan </strong>
        </div>
        <br />
        <hr />
        <div hidden={this.state.hideSpinner} style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
        <div className="container">
          <span
            className="menuitem"
            style={{
              cursor: "pointer",
              paddingLeft: "130px"
            }}
          >
            <Link
              style={{ color: "blue", textDecoration: "None" }}
              to="/loans/actionpage"
            >
              <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} />{" "}
              Request new loan
            </Link>
          </span>
        </div>
        <hr />
        <div className="container">
          <p>
            <strong>Loan History:</strong>{" "}
          </p>
          {this.state.returningLoanCustomer ? this.returnLoanHistory() : " "}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  applications: state.applications.loans,
  deposit: state.deposit.deposit,
  resolve: state.applications.resolve,
  repay: state.applications.repay
});

export default connect(
  mapStateToProps,
  { getLoans, depositFund, resolveLoan, repayLoan }
)(LoanHome);
