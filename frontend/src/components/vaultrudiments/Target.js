import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";
import { Link } from "react-router-dom";
import "./Help.css";
import { getLinkedCards } from "../../actions/cards";
import { addTargetS, contribTargetS } from "../../actions/targetsavings";

import { Modal } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";

export class Targetchild extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      cardlinkError: false,
      disableButton: true,
      category: "",
      customName: "",
      targetAmount: "",
      timeline: "12",
      debitFrequency: "Monthly",
      debitAmount: "0.00",
      interestEarned: "0.00",
      startDate: this.getDate(),
      endDate: "",
      locked: false,
      categoryError: false,
      customNameError: false,
      targetAmountError: false,
      modalShow: false
    };
    this.targetAmountRef = React.createRef();
    this.timelineRef = React.createRef();
    this.debitFrequencyRef = React.createRef();
  }
  static propTypes = {
    getLinkedCards: PropTypes.func.isRequired,
    addTargetS: PropTypes.func.isRequired,
    contribTargetS: PropTypes.func.isRequired
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
  appendLeadingZero = number => {
    if (number <= 9) {
      return "0" + number;
    }
    return number;
  };

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
    var x = this.targetAmountRef.current.value;
    var y = this.timelineRef.current.value;
    var z = this.debitFrequencyRef.current.value;
    if (z === "Monthly") {
      this.state.debitAmount = (x / y).toFixed(2);
      this.state.interestEarned = parseFloat(((0.1 * x) / 12) * y).toFixed(2);
    } else if (z === "Weekly") {
      this.state.debitAmount = (x / (y * 4)).toFixed(2);
      this.state.interestEarned = parseFloat(((0.1 * x) / 12) * y).toFixed(2);
    } else if (z === "Daily") {
      this.state.debitAmount = (x / (y * 4 * 7)).toFixed(2);
      this.state.interestEarned = parseFloat(((0.1 * x) / 12) * y).toFixed(2);
    }
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
      this.state.category == "" ||
      this.state.customName == "" ||
      this.state.targetAmount == "" ||
      parseInt(this.state.targetAmount) < 1000
    ) {
      if (this.state.category == "") {
        this.setState({ categoryError: true });
      } else if (this.state.customName == "") {
        this.setState({ customNameError: true });
      } else if (
        this.state.targetAmount == "" ||
        parseInt(this.state.targetAmount) < 1000
      ) {
        this.setState({ targetAmountError: true });
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
      targetAmount,
      startDate,
      endDate,
      timeline,
      debitFrequency,
      debitAmount,
      interestEarned,
      locked
    } = this.state;

    const newStartDate = new Date(startDate).toISOString();
    const newEndDate = new Date(endDate).toISOString();
    let lockedValue = "";
    if (locked === true) {
      lockedValue = "YES";
    } else {
      lockedValue = "NO";
    }

    const body = {
      custom_name: customName,
      tenor: timeline,
      start_date: newStartDate,
      end_date: newEndDate,
      target: targetAmount,
      amount_to_charge: debitAmount,
      autodebit: debitFrequency,
      interest: interestEarned,
      locked: lockedValue
    };

    const body2 = {
      send_fund: true,
      amount: debitAmount
    };
    this.props.addTargetS(body);
    setTimeout(() => this.props.contribTargetS(body2), 3000);
    this.modalClose();
    this.setState({
      step: 1,
      targetAmount: "",
      customName: ""
    });
  };
  handleLock = () => {
    const { locked } = this.state;
    this.setState({
      locked: !locked
    });
  };
  render() {
    const { step } = this.state;
    const {
      timeline,
      targetAmount,
      category,
      customName,
      debitAmount,
      debitFrequency,
      interestEarned,
      startDate,
      endDate
    } = this.state;

    switch (step) {
      case 1:
        return (
          <Fragment>
            <div className="card p-1 shadow p-4 mb-4 bg-white">
              <h2 className="text-center">
                <strong>Let's create your plan</strong>
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
                          <strong>
                            Tell us a bit about what you're saving for
                          </strong>
                          <br />
                          <select
                            name="category"
                            defaultValue={category}
                            onChange={this.onChange}
                            className="form-control"
                          >
                            <option />
                            <option value="automobileRepair">
                              Vehicle/automobile repair
                            </option>
                            <option value="automobilePurchase">
                              Vehicle/automobile purchase
                            </option>
                            <option value="childSupport">
                              Child support/fees
                            </option>
                            <option value="homePurchase">Home purchase</option>
                            <option value="marriage">Marriage</option>
                            <option value="newEquipment">
                              New gadget/equipment
                            </option>
                            <option value="schoolFees">School fees</option>
                            <option value="pesonal">
                              Personal/Other reasons
                            </option>
                          </select>
                          <small
                            hidden={!this.state.categoryError}
                            style={{ color: "red" }}
                          >
                            Select from list
                          </small>
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Custom plan name</strong>
                          <br />
                          <input
                            name="customName"
                            onChange={this.onChange}
                            className="form-control"
                            type="text"
                            placeholder="e.g My Car plan"
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
                          <strong>Target amount</strong>
                          <br />
                          <input
                            name="targetAmount"
                            className="form-control"
                            type="number"
                            placeholder="1000000"
                            ref={this.targetAmountRef}
                            onChange={this.onChange}
                            value={targetAmount}
                            onInput={this.onInput}
                          />
                          <small
                            hidden={!this.state.targetAmountError}
                            style={{ color: "red" }}
                          >
                            Enter target amount > ₦1000.00
                          </small>
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>
                            Select timeline goal: {timeline} month(s)
                          </strong>
                          <br />
                          <input
                            defaultValue={timeline}
                            onChange={this.handleSlider}
                            type="range"
                            min="1"
                            max="36"
                            className="slider"
                            onInput={this.onInput}
                            ref={this.timelineRef}
                          />
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Debit frequency</strong>
                          <br />
                          <select
                            name="debitFrequency"
                            value={debitFrequency}
                            className="form-control"
                            onChange={this.onChange}
                            onInput={this.onInput}
                            ref={this.debitFrequencyRef}
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </p>
                      </div>
                      <div className="form-group">
                        <p>
                          {" "}
                          <strong>Debit amount </strong>
                          <br />
                          <input
                            className="form-control"
                            readOnly
                            type="text"
                            name="debitAmount"
                            id="debitAmount"
                            value={"₦ " + debitAmount}
                            onChange={this.onChange}
                          />
                        </p>
                      </div>

                      <div
                        style={{ textAlign: "right" }}
                        className="form-group"
                      >
                        <button
                          onClick={() => this.continue()}
                          type="button"
                          disabled={this.state.disableButton}
                          className="btn btn-primary btn-sm"
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
                <h4>Target savings prompt</h4>
                <p>
                  Your target savings plan will become effective after the
                  clicking the confirm button, initial debit on your linked
                  debit card will be made on your preferred start date. Kindly
                  ensure your debit card or vault wallet is well funded at the
                  set debit timings. You'll be duly updated on your account
                  activities.
                </p>
                <span>
                  <Tooltip
                    TransitionComponent={Fade}
                    classes={{ tooltip: "380" }}
                    TransitionProps={{ timeout: 600 }}
                    title="Commit to your plan. Worry less, Vault24 has emergency loan support in place for you to settle unforseen circumstances instead of bailing out of your target goal."
                  >
                    <Button onClick={this.handleLock}> Lock-in Plan</Button>
                  </Tooltip>
                </span>
                <Switch
                  checked={this.state.locked}
                  onChange={this.handleLock}
                  color="primary"
                />
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
                <strong>You're almost there</strong>
              </h2>

              <br />
              <br />
              <div className="container">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <form>
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
                          <small style={{ color: "green" }}>
                            <strong>
                              Interest on net savings: ₦{interestEarned} @10%
                              per annum (T&C applies)
                            </strong>
                          </small>
                        </p>
                      </div>

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
                          onClick={this.handleSubmit}
                          disabled={this.state.disableButton}
                          className="btn btn-primary btn-sm"
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
  linkedcards: state.cards.linkedcards
});

export default connect(
  mapStateToProps,
  { getLinkedCards, addTargetS, contribTargetS }
)(Targetchild);
