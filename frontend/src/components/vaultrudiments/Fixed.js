import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import { Link } from "react-router-dom";

import { Modal } from "react-bootstrap";

import { getLinkedCards } from "../../actions/cards";
import { addFixds, depositFixds } from "../../actions/fixeddeposit";

export class Fixedchild extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      cardlinkError: false,
      disableButton: true,
      customName: "",
      amount: "",
      timeline: "6",
      interestEarned: "0.00",
      netPayout: "0.00",
      startDate: this.getDate(),
      endDate: "",
      customNameError: false,
      amountError: false,
      modalShow: false
    };
    this.amountRef = React.createRef();
    this.timelineRef = React.createRef();
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    getLinkedCards: PropTypes.func.isRequired,
    addFixds: PropTypes.func.isRequired,
    depositFixds: PropTypes.func.isRequired
  };

  appendLeadingZero = number => {
    if (number <= 9) {
      return "0" + number;
    }
    return number;
  };

  componentDidMount() {
    this.props.getLinkedCards();
  }

  componentDidUpdate(prevProps) {
    const { linkedcards } = this.props;

    if (this.props.linkedcards !== prevProps.linkedcards) {
      if (this.props.linkedcards.length === 1) {
        this.setState({
          disableButton: false
        });
      } else {
        this.setState({
          cardlinkError: true
        });
      }
    }
  }

  getDate = () => {
    let current_date = new Date();
    let formatted_date =
      this.appendLeadingZero(current_date.getFullYear()) +
      "-" +
      this.appendLeadingZero(current_date.getMonth() + 1) +
      "-" +
      this.appendLeadingZero(current_date.getDate());
    return formatted_date;
  };
  getEndDate = (date, month) => {
    let initialStartDate = new Date(date).getDate();
    let latterDate = new Date(date).setDate(
      initialStartDate + parseInt(month) * 30
    );
    const newDate = new Date(latterDate);

    let formatted_date =
      this.appendLeadingZero(newDate.getFullYear()) +
      "-" +
      this.appendLeadingZero(newDate.getMonth() + 1) +
      "-" +
      this.appendLeadingZero(newDate.getDate());

    this.state.endDate = formatted_date;
    return formatted_date;
  };

  onChange = e =>
    this.setState({
      [e.target.name]: e.target.value,
      [e.target.name + "Error"]: false
    });

  handleSlider = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.state.timeline = e.target.value;
  };

  onInput = e => {
    var x = this.amountRef.current.value;
    var y = this.timelineRef.current.value;
    if (x == "") {
      x = 0;
    }
    this.state.interestEarned = parseFloat(((0.4 * x) / 12) * y).toFixed(2);
    this.state.netPayout = parseFloat(
      parseInt(((0.4 * x) / 12) * y) + parseInt(x)
    ).toFixed(2);
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  prevStep = e => {
    e.preventDefault();
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  continue = () => {
    if (
      this.state.customName == "" ||
      this.state.amount == "" ||
      parseInt(this.state.amount) < 99999.99
    ) {
      if (this.state.customName == "") {
        this.setState({ customNameError: true });
      } else if (
        this.state.amount == "" ||
        parseInt(this.state.amount) < 99999.99
      ) {
        this.setState({ amountError: true });
      }
    } else {
      this.nextStep();
    }
  };

  modalClose = () => {
    this.setState({
      modalShow: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      modalShow: true
    });
  };

  handleConfirm = e => {
    e.preventDefault();
    const {
      customName,
      amount,
      startDate,
      endDate,
      timeline,
      interestEarned
    } = this.state;
    const { user } = this.props.auth;

    const newStartDate = new Date(startDate).toISOString();
    const newEndDate = new Date(endDate).toISOString();

    const body = {
      custom_name: customName,
      tenor: timeline,
      start_date: newStartDate,
      end_date: newEndDate,
      amount_planned: amount,
      interest: interestEarned,
      signature: user.fullname
    };

    const body2 = {
      send_fund: true,
      amount: amount
    };
    this.props.addFixds(body);
    setTimeout(() => this.props.depositFixds(body2), 3000);
    this.modalClose();
    this.setState({
      step: 1,
      amount: "",
      customName: ""
    });
  };

  render() {
    const { user } = this.props.auth;
    const { step } = this.state;
    const {
      timeline,
      amount,
      customName,
      interestEarned,
      netPayout,
      startDate,
      endDate
    } = this.state;
    switch (step) {
      case 1:
        return (
          <Fragment>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <h2 className="text-center">
                <strong>Investment form</strong>
              </h2>
              <div style={{ textAlign: "center" }}>
                <Alert color="danger" isOpen={this.state.cardlinkError}>
                  <strong>
                    Please add a debit card before prodeeding. Click{" "}
                    <Link
                      style={{ textDecoration: "None" }}
                      to="/vault/managecards"
                    >
                      HERE
                    </Link>{" "}
                    to add card
                  </strong>
                </Alert>
              </div>
              <br />
              <br />
              <div className="container">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <form>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Custom investment name</strong>
                          <br />
                          <input
                            name="customName"
                            onChange={this.onChange}
                            className="form-control"
                            type="text"
                            placeholder="e.g Investment plan 1"
                            value={customName}
                            maxLength="20"
                          />
                          <small
                            hidden={!this.state.customNameError}
                            style={{ color: "red" }}
                          >
                            Enter custom plan name
                          </small>
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Investment amount</strong>
                          <br />
                          <input
                            name="amount"
                            className="form-control"
                            type="number"
                            placeholder="min. ₦100000"
                            ref={this.amountRef}
                            onChange={this.onChange}
                            value={amount}
                            onInput={this.onInput}
                          />
                          <small
                            hidden={!this.state.amountError}
                            style={{ color: "red" }}
                          >
                            Investment amount must be > ₦99999.99
                          </small>
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>
                            Select holding period: {timeline} month(s)
                          </strong>
                          <br />
                          <input
                            defaultValue={timeline}
                            onChange={this.handleSlider}
                            type="range"
                            min="6"
                            max="12"
                            className="slider"
                            onInput={this.onInput}
                            ref={this.timelineRef}
                          />
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong style={{ color: "green" }}>
                            Interest rate: 40% per annum
                          </strong>
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Net Payout</strong>
                          <br />
                          <input
                            className="form-control"
                            readOnly
                            type="text"
                            name="netPayout"
                            id="debitAmount"
                            value={"₦" + netPayout}
                            onChange={this.onChange}
                          />
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Start date </strong>
                          <br />
                          <input
                            required
                            className="form-control"
                            type="date"
                            name="startDate"
                            min={startDate}
                            value={startDate}
                            onInput={this.dateInput}
                            onChange={this.onChange}
                          />
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>End date </strong>
                          <br />
                          <input
                            readOnly
                            className="form-control"
                            type="date"
                            value={this.getEndDate(startDate, timeline)}
                            onChange={this.onChange}
                          />
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Signature</strong>
                          <br />
                          <input
                            readOnly
                            className="form-control"
                            type="text"
                            defaultValue={user.fullname}
                            maxLength="30"
                            onChange={this.onChange}
                          />
                        </p>
                      </div>

                      <div
                        style={{ textAlign: "right" }}
                        className="form-group"
                      >
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => this.continue()}
                          disabled={this.state.disableButton}
                        >
                          Next >>>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <Modal
              show={this.state.modalShow}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              onHide={this.modalClose}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Vault24 plan
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Fixed/Investment deposit prompt</h4>
                <p>
                  Your Investment plan will become effective after the clicking
                  the confirm button, a debit transaciton will be made on your
                  linked debit card as per your preferred start date. Kindly
                  ensure your debit card or vault wallet is well funded at the
                  set debit timings. You'll be duly updated on your account
                  activities.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={this.handleConfirm}
                >
                  Confirm
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.modalClose}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <h2 className="text-center">
                <strong>Investment Brief</strong>
              </h2>

              <br />
              <br />
              <div className="container">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <form>
                      <p>
                        Dear <strong>{user.fullname} </strong>, <br />
                        We are happy to have you as one of Vault24 potential
                        investors; to finalise the process continue with the
                        button below. However before you proceed with finalising
                        your investment plan setup, kindly go through our
                        investment brief.
                      </p>
                      <p>
                        Our investment plan is one of the most rewarding
                        investment packages in the banking and financial space
                        with an ROI of 40% interest on inital capital per annum.
                        However should in case of liquidation before investment
                        maturation, Vault24 will charge 30% off accrued interest
                        during the investment period.
                      </p>
                      <p>
                        We also at Vault24 do acknowledge that unforseen
                        cirucmstances may result in need for emergency cash
                        influx; for this reason we have a loan support in place
                        for you. Customers need not to bail out of investment
                        packages to relieve emergencies, with our 2% interest
                        for a 30 day loan put in place to address such need.
                      </p>
                      Below is a break down of your investment plan
                      <br />
                      <h5 style={{ textAlign: "center" }}>
                        Investment Details
                      </h5>
                      <table border="0" style={{ margin: "0 auto" }}>
                        <tbody>
                          <tr>
                            <th>Investment amount:</th>
                            <td>₦{amount}</td>
                          </tr>
                          <tr>
                            <th>Interest rate:</th>
                            <td>40% per annum</td>
                          </tr>
                          <tr>
                            <th>Net payout:</th>
                            <td>₦{netPayout}</td>
                          </tr>
                          <tr>
                            <th>Start date:</th>
                            <td>{startDate}</td>
                          </tr>
                          <tr>
                            <th>Maturity date:</th>
                            <td>{endDate}</td>
                          </tr>
                        </tbody>
                      </table>
                      <p>
                        We look forward to seeing you at the other side. Click
                        the button below to finalise process and become an
                        investor.
                      </p>
                      <div
                        style={{ textAlign: "center" }}
                        className="form-group"
                      >
                        <button
                          style={{ marginRight: "10px" }}
                          className="btn btn-primary btn-sm"
                          onClick={this.prevStep}
                        >
                          Back
                        </button>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={this.handleSubmit}
                        >
                          Get started
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  linkedcards: state.cards.linkedcards
});

export default connect(
  mapStateToProps,
  { getLinkedCards, addFixds, depositFixds }
)(Fixedchild);
