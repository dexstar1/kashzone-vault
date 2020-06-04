import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";

import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, alert, message } = this.props;
    if (error !== prevProps.error) {
      if (error.msg.status == "failed") alert.error(error.msg.message);
      if (error.msg.status == "lookup error") alert.error(error.msg.message);
      if (error.msg.phone_number)
        alert.error(`Phone Number: ${error.msg.phone_number.join()}`);
      if (error.msg.password)
        alert.error(`Password: ${error.msg.password.join()}`);
      if (error.msg.non_field_errors)
        alert.error(error.msg.non_field_errors.join());
    }

    if (message !== prevProps.message) {
      if (message.addToken) alert.success(message.addToken);
      if (message.postEmail) alert.success(message.postEmail);
      if (message.passwordsNotMatch) alert.error(message.passwordsNotMatch);
      if (message.addLoan) alert.success(message.addLoan);
      if (message.resolveLoan) alert.success(message.resolveLoan);
      if (message.makeWithdraw) alert.success(message.makeWithdraw);
      if (message.deposit) alert.success(message.deposit);
      if (message.addFixds) alert.success(message.addFixds);
      if (message.addLittleD) alert.success(message.addLittleD);
      if (message.verifyAccount) alert.success(message.verifyAccount);
      if (message.postProfile) alert.success(message.postProfile);
      if (message.postAuth) alert.success(message.postAuth);
      if (message.addRentP) alert.success(message.addRentP);
      if (message.addTargetS) alert.success(message.addTargetS);
      if (message.makeTransfer) alert.success(message.makeTransfer);
      if (message.liquidatePlan) alert.success(message.liquidatePlan);
    }
  }
  render() {
    return <Fragment />;
  }
}

const mapStatetoProps = state => ({
  error: state.errors,
  message: state.messages
});

export default connect(mapStatetoProps)(withAlert()(Alerts));
