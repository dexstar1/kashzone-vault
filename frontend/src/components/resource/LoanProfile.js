import React, { Component } from "react";
import BankDetails from "../vaultrudiments/BankDetails";
import LoanChoice from "../vaultrudiments/LoanChoice";
import Success from "../vaultrudiments/Success";

export class LoanProfile extends Component {
  state = {
    step: 1,
    email: "",
    phoneNumber: "",
    bankName: "",
    bankAccount: "",
    fullName: ""
  };
  //Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  //Go to preve step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  //Handle Field Change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  render() {
    const { step } = this.state;
    const { email, phoneNumber, bankName, bankAccount, fullName } = this.state;

    const values = {
      email,
      phoneNumber,
      bankName,
      bankAccount,
      fullName
    };

    switch (step) {
      case 1:
        return (
          <BankDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );

      case 2:
        return <LoanChoice nextStep={this.nextStep} />;

      case 3:
        return <Success />;
    }
  }
}

export default LoanProfile;
