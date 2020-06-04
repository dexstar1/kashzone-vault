import React, { Component } from "react";
import LoanChoiceChild from "../vaultrudiments/LoanChoice";
import Success from "../vaultrudiments/Success";

export class LoanChoice extends Component {
  state = {
    step: 1
  };
  //Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  render() {
    const { step } = this.state;

    switch (step) {
      case 1:
        return <LoanChoiceChild nextStep={this.nextStep} />;
      case 2:
        return <Success />;
    }
  }
}

export default LoanChoice;
