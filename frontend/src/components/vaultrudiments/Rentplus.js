import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Col, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import "./Help.css";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLinkedCards } from "../../actions/cards";
import { addRentP, contribRentP } from "../../actions/rentplus";

import { Modal } from "react-bootstrap";

export class Rentpluschild extends Component {
  constructor() {
    super();
    this.state = {
      cardlinkError: false,
      disableButton: true,
      targetAmount: "",
      timeline: "12",
      debitFrequency: "Monthly",
      debitAmount: "0.00",
      interestEarned: "0.00",
      startDate: this.getDate(),
      endDate: "",
      locked: false,
      invalidInput: false,
      modalShow: false
    };
    this.targetAmountRef = React.createRef();
    this.timelineRef = React.createRef();
    this.debitFrequencyRef = React.createRef();
  }

  static propTypes = {
    getLinkedCards: PropTypes.func.isRequired,
    addRentP: PropTypes.func.isRequired,
    contribRentP: PropTypes.func.isRequired
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
  createEndDate = () => {
    startingpoint = new Date();
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

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
      this.state.interestEarned = parseFloat(((0.083 * x) / 12) * y).toFixed(2);
    } else if (z === "Weekly") {
      this.state.debitAmount = (x / (y * 4)).toFixed(2);
      this.state.interestEarned = parseFloat(((0.083 * x) / 12) * y).toFixed(2);
    } else if (z === "Daily") {
      this.state.debitAmount = (x / (y * 4 * 7)).toFixed(2);
      this.state.interestEarned = parseFloat(((0.083 * x) / 12) * y).toFixed(2);
    }
  };

  dateInput = e => {
    //vestigial testing function may be removed in production
    let y = this.dateRef.current.value;
    console.log(y);
  };

  lockedIn = truthValue => {
    if ((truthValue = true)) {
      this.setState({
        locked: "YES"
      });
    } else {
      this.setState({
        locked: "NO"
      });
    }
  };

  handleSubmit = () => {
    const amount = parseInt(this.state.targetAmount);
    if (this.state.targetAmount === "") {
      this.setState({
        invalidInput: true
      });
    }
    if (amount < 1200) {
      this.setState({
        invalidInput: true
      });
    }
    if (amount > 200000) {
      this.setState({
        invalidInput: true
      });
    }
    if (this.state.targetAmount !== "" && amount < 200001 && amount >= 1200) {
      this.setState({
        modalShow: true
      });
    }
  };

  modalClose = () => {
    this.setState({
      modalShow: false
    });
  };

  handleConfirm = () => {
    console.log(this.state);
    const {
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
    console.log(newStartDate);
    console.log(newEndDate);
    let lockedValue = "";
    if (locked === true) {
      lockedValue = "YES";
    } else {
      lockedValue = "NO";
    }
    const body = {
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
    this.props.addRentP(body);
    setTimeout(() => this.props.contribRentP(body2), 3000);
    this.modalClose();
    this.setState({
      targetAmount: ""
    });
  };
  render() {
    const {
      timeline,
      targetAmount,
      debitAmount,
      debitFrequency,
      interestEarned,
      startDate,
      endDate
    } = this.state;

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
            <h4>Rent Plus prompt</h4>
            <p>
              Your rent plus plan will become effective after the clicking the
              confirm button, initial debit on your linked debit card will be
              made on your preferred start date. Kindly ensure your debit card
              or vault wallet is well funded at the set debit timings. You'll be
              duly updated on your account activities.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary btn-sm"
              onClick={this.handleConfirm}
            >
              Confirm
            </button>
            <button className="btn btn-danger btn-sm" onClick={this.modalClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <div className="container" style={{ width: "100%" }}>
          <Form>
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

            <FormGroup row>
              <Label for="targetAmount" sm={2}>
                Target amount:
              </Label>
              <Col>
                <Input
                  type="number"
                  name="targetAmount"
                  innerRef={this.targetAmountRef}
                  onChange={this.onChange}
                  defaultValue={targetAmount}
                  onInput={this.onInput}
                  invalid={this.state.invalidInput}
                />
              </Col>
              <Label for="examplePassword" sm={2}>
                Timeline: <strong> {timeline} month(s)</strong>
              </Label>
              <Col sm={5}>
                {" "}
                <input
                  type="range"
                  min="1"
                  max="12"
                  defaultValue={timeline}
                  className="slider"
                  onChange={this.handleSlider}
                  onInput={this.onInput}
                  ref={this.timelineRef}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleSelect" sm={2}>
                Start date:
              </Label>
              <Col>
                <Input
                  required
                  type="date"
                  name="startDate"
                  min={startDate}
                  defaultValue={startDate}
                  onInput={this.dateInput}
                  onChange={this.onChange}
                />
              </Col>
              <Label for="exampleSelect" sm={2}>
                End date:
              </Label>
              <Col sm={5}>
                <Input
                  readOnly
                  type="date"
                  value={this.getEndDate(startDate, timeline)}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleSelect" sm={2}>
                Debit frequency:
              </Label>
              <Col>
                <select
                  defaultValue={debitFrequency}
                  className="browser-default custom-select"
                  onChange={this.onChange}
                  onInput={this.onInput}
                  ref={this.debitFrequencyRef}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </Col>
              <Label for="exampleSelect" sm={2}>
                Debit amount:
              </Label>
              <Col sm={5}>
                <Input
                  readOnly
                  type="text"
                  name="debitAmount"
                  id="debitAmount"
                  value={"₦ " + debitAmount}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>
                <strong
                  onMouseOver={function() {
                    return "Hello";
                  }}
                >
                  {" "}
                  Locked-in
                </strong>{" "}
                <FontAwesomeIcon icon={faQuestionCircle} /> :
              </Label>
              <Col>
                <label className="radio-inline">
                  <input
                    onClick={() => this.lockedIn(true)}
                    type="radio"
                    name="optradio"
                  />{" "}
                  Yes
                </label>
                <br />
                <label className="radio-inline">
                  <input
                    defaultChecked
                    onClick={() => this.lockedIn(false)}
                    type="radio"
                    name="optradio"
                  />{" "}
                  No
                </label>
              </Col>
              <Label for="exampleSelect" sm={2}>
                Interest earned:
              </Label>
              <Col sm={5}>
                <Input
                  readOnly
                  type="text"
                  name="interestEarned"
                  id="interestEarned"
                  value={`@8.3% /annum: ₦ ${parseFloat(
                    ((0.083 * targetAmount) / 12) * timeline
                  ).toFixed(2)}`}
                  onChange={this.onChange}
                />
              </Col>
            </FormGroup>
            <FormGroup check row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button
                  type="button"
                  disabled={this.state.disableButton}
                  onClick={() => this.handleSubmit()}
                >
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  linkedcards: state.cards.linkedcards
});

export default connect(
  mapStateToProps,
  { getLinkedCards, addRentP, contribRentP }
)(Rentpluschild);
