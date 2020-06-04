import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addLittleD,
  getLittleD,
  littleWithdraw,
  littleDrop
} from "../../actions/littledrops";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Modal } from "react-bootstrap";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import { UncontrolledTooltip } from "reactstrap";

import { getLinkedCards } from "../../actions/cards";

export class LittleDrops extends Component {
  constructor() {
    super();
    this.state = {
      hideBuild: true,
      hideDrops: true,
      hideSpinner: false,
      amountSaved: "",
      monthInterest: "",
      streak: "",
      avg: "",
      lastAction: "",
      tToWalletAmount: "",
      tToLittleDropsAmount: "",
      actionUpColor: "0.1",
      actionDownColor: "0.1",
      transactionAsource: "Vault Wallet",
      hideFormA: false,
      hideForm: false,
      modalShowa: false,
      modalShowb: false,
      hideModalSpinnerA: true,
      hideModalSpinnerB: true,
      transactionSuccessA: false,
      transactionSuccessB: false,
      hideButtonA: false,
      hideButtonB: false,
      disableButtonA: false,
      card: false,
      LinkedcardError: false,
      showCardError: false
    };
  }

  static propTypes = {
    addLittleD: PropTypes.func.isRequired,
    getLittleD: PropTypes.func.isRequired,
    getLinkedCards: PropTypes.func.isRequired,
    littleWithdraw: PropTypes.func.isRequired,
    littleDrop: PropTypes.func.isRequired
  };
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  componentDidMount() {
    this.props.getLittleD();
    this.props.getLinkedCards();
  }

  componentDidUpdate(prevProps) {
    const { littledrops } = this.props;
    const response = { littledrops };
    if (this.props.littledrops !== prevProps.littledrops) {
      if (this.props.littledrops.length === 0) {
        this.setState({
          hideSpinner: true,
          hideBuild: false
        });
      }
      if (this.props.littledrops.length > 0) {
        this.setState({
          hideSpinner: true,
          hideDrops: false,
          amountSaved: response.littledrops[0].amount_saved,
          monthInterest: response.littledrops[0].month_interest,
          streak: response.littledrops[0].streak,
          avg: response.littledrops[0].average_deposit,
          lastAction: response.littledrops[0].last_action
        });
        if (response.littledrops[0].last_action == "up") {
          this.setState({
            actionUpColor: "1",
            actionDownColor: "0.1"
          });
        } else {
          this.setState({
            actionDownColor: "1",
            actionUpColor: "0.1"
          });
        }
      }
    }
    if (this.props.linkedcards !== prevProps.linkedcards) {
      if (this.props.linkedcards.length < 1) {
        this.setState({
          LinkedcardError: true
        });
      }
    }
    if (this.props.withdrawfunds !== prevProps.withdrawfunds) {
      if (
        this.props.withdrawfunds[this.props.withdrawfunds.length - 1].status ===
        "success"
      ) {
        this.setState({
          hideForm: true,
          transactionSuccessB: true,
          hideModalSpinnerB: true,
          hideButtonB: false
        });
        this.props.getLittleD();
      }
    }
    if (this.props.dripdrop !== prevProps.dripdrop) {
      if (
        this.props.dripdrop[this.props.dripdrop.length - 1].status === "success"
      ) {
        this.setState({
          hideFormA: true,
          transactionSuccessA: true,
          hideModalSpinnerA: true,
          hideButtonA: false
        });
        this.props.getLittleD();
      }
    }
  }

  handelBuild = () => {
    let quantum = { create: true };
    this.props.addLittleD(quantum);
    this.setState({
      hideBuild: true,
      hideDrops: false
    });
  };

  modalClose = () => {
    this.setState({
      modalShowa: false,
      modalShowb: false
    });
  };

  showModalA = () => {
    this.setState({
      modalShowa: true
    });
  };
  showModalB = () => {
    this.setState({
      modalShowb: true
    });
  };

  handleTransfertoWallet = e => {
    e.preventDefault();
    const savingsBal = parseFloat(this.state.amountSaved);
    const choiceValue = parseInt(this.state.tToWalletAmount);

    if (choiceValue < 1 || choiceValue > savingsBal) {
      this.modalClose();
      this.setState({
        tToWalletAmount: ""
      });
    } else {
      this.setState({
        hideButtonB: true,
        hideModalSpinnerB: false
      });
      const body = { send_fund: true, amount: choiceValue };
      this.props.littleWithdraw(body);
    }
  };

  handleCardOption = () => {
    const { card, LinkedcardError } = this.state;
    if (card === false) {
      if (LinkedcardError === true) {
        this.setState({
          card: !card,
          disableButtonA: true,
          showCardError: true
        });
      } else if (LinkedcardError === false) {
        this.setState({
          card: !card
        });
      }
    } else if (card === true) {
      if (LinkedcardError === true) {
        this.setState({
          card: !card,
          disableButtonA: false,
          showCardError: false
        });
      } else if (LinkedcardError === false) {
        this.setState({
          card: !card
        });
      }
    }
  };

  handleDeposit = e => {
    e.preventDefault();
    const wbalance = parseInt(this.props.wallet[0][0].balance);
    const choiceValue = parseInt(this.state.tToLittleDropsAmount);
    const useCard = this.state.card;
    let source = "";
    if (useCard === false) {
      source = "Vault Wallet";
    } else if (useCard === true) {
      source = "Debit Card";
    }

    if (source === "Vault Wallet") {
      if (choiceValue < 1 || choiceValue > wbalance) {
        this.modalClose();
        this.setState({
          tToLittleDropsAmount: ""
        });
      } else {
        const body = {
          send_fund: true,
          amount: choiceValue,
          source: source
        };
        this.setState({
          hideButtonA: true,
          hideModalSpinnerA: false
        });
        this.props.littleDrop(body);
      }
    }
    if (source === "Debit Card") {
      if (choiceValue < 50) {
        this.modalClose();
        this.setState({
          tToLittleDropsAmount: ""
        });
      } else {
        const body = {
          send_fund: true,
          amount: choiceValue,
          source: source
        };
        this.setState({
          hideButtonA: true,
          hideModalSpinnerA: false
        });
        this.props.littleDrop(body);
      }
    }
  };

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modalShowa}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.modalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add drops
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form hidden={this.state.hideFormA} onSubmit={this.handleDeposit}>
              <div hidden={!this.state.showCardError} className="text-center">
                <h6 style={{ fontWeight: "600" }}>
                  Click{" "}
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/vault/managecards"
                  >
                    HERE
                  </Link>{" "}
                  to add card before proceeding
                </h6>

                <br />
              </div>
              <div className="form-group">
                <input
                  required
                  type="number"
                  placeholder="Enter amount"
                  className="form-control"
                  value={this.state.tToLittleDropsAmount}
                  onChange={this.handleChange("tToLittleDropsAmount")}
                />
              </div>
              <div>
                <h6 style={{ display: "inline", fontWeight: "600" }}> Card </h6>

                <a id="dropMessage">
                  <FontAwesomeIcon
                    style={{ opacity: "0.7", cursor: "pointer" }}
                    icon={faQuestionCircle}
                  />
                </a>
                <UncontrolledTooltip placement="bottom" target="dropMessage">
                  Vault automatically tries to drop from your wallet balance,
                  toggle the switch icon to change option to Linked Card
                </UncontrolledTooltip>
                <Switch
                  checked={this.state.card}
                  onChange={this.handleCardOption}
                />
              </div>
              <div hidden={this.state.hideButtonA} className="text-center">
                <button
                  disabled={this.state.disableButtonA}
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Confirm
                </button>
              </div>
              <div
                hidden={this.state.hideModalSpinnerA}
                className="form-group text-center"
              >
                <CircularProgress disableShrink />
              </div>
            </form>
            <div
              hidden={!this.state.transactionSuccessA}
              className="text-center"
            >
              <FontAwesomeIcon size="2x" color="#dd4f05" icon={faCheck} />
              <br />
              <h2>Drip.. Drip.. Dropped!</h2>
              <br />
              <FontAwesomeIcon size="2x" color="#dd4f05" icon={faThumbsUp} />
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalShowb}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.modalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Withdraw to wallet
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              hidden={this.state.hideForm}
              onSubmit={this.handleTransfertoWallet}
            >
              <div className="form-group">
                <input
                  required
                  type="number"
                  placeholder="Enter amount"
                  className="form-control"
                  value={this.state.tToWalletAmount}
                  onChange={this.handleChange("tToWalletAmount")}
                />
              </div>
              <div
                hidden={this.state.hideButtonB}
                className="form-group text-center"
              >
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm
                </button>
              </div>
              <div
                hidden={this.state.hideModalSpinnerB}
                className="form-group text-center"
              >
                <CircularProgress disableShrink />
              </div>
            </form>
            <div
              hidden={!this.state.transactionSuccessB}
              className="text-center"
            >
              <FontAwesomeIcon size="2x" color="#dd4f05" icon={faCheck} />
              <br />
              <h2>Wallet Credited</h2>
              <br />
              <FontAwesomeIcon size="2x" color="#dd4f05" icon={faThumbsUp} />
            </div>
          </Modal.Body>
        </Modal>
        <div>
          <strong>Little Drops</strong>
        </div>
        <br />
        <div hidden={this.state.hideSpinner} className="text-center">
          <CircularProgress disableShrink />
        </div>
        <div
          hidden={this.state.hideBuild}
          style={{ textAlign: "center" }}
          className="container"
        >
          <button
            onClick={() => this.handelBuild()}
            className="btn btn-primary btn-sm"
          >
            Build your bucket
          </button>
          <br />
          <br />

          <p>
            <b> Click the button above to start dropping in your bucket</b>
          </p>
        </div>
        <div hidden={this.state.hideDrops}>
          <div style={{ float: "right" }}>
            <p>
              <FontAwesomeIcon icon={faSignal} />
              <strong>
                {" "}
                Streak : {this.state.streak} Avg: ₦{this.state.avg}{" "}
              </strong>
            </p>
          </div>
          <br />
          <div className="text-center">
            <div style={{ display: "inline-block" }}>
              {" "}
              <h1>₦{this.state.amountSaved}</h1>
            </div>
            <div
              style={{
                display: "inline-block",
                marginLeft: "10px"
              }}
            >
              <div
                style={{ opacity: this.state.actionUpColor }}
                className="bucketgain"
              />
              <div
                style={{ opacity: this.state.actionDownColor }}
                className="bucketdrop"
              />
            </div>
            <br />
            <br />

            <div>
              <button
                onClick={() => this.showModalA()}
                className="btn btn-primary btn-sm"
              >
                Drop
              </button>
              &nbsp; &nbsp;
              <button
                onClick={() => this.showModalB()}
                className="btn btn-primary btn-sm"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <hr />
        <div hidden={this.state.hideDrops}>
          <div className="row">
            <div className="col-md-4">
              <p>Interest </p>
              <div className="card">
                <div
                  style={{
                    backgroundColor: "#dd4f05",
                    fontWeight: "600",
                    color: "#fff"
                  }}
                  className="card-header"
                >
                  <h3>This month: June 2019</h3>
                </div>
                <div className="card-body">
                  <h1 style={{ textAlign: "center" }}>
                    <b> ₦{this.state.monthInterest}</b>
                  </h1>
                  <br />
                  <br />

                  <div style={{ textAlign: "right" }}>
                    <button className="btn btn-primary">View history</button>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="col-md-4">
              <p>Deals </p>
              <div className="card">
                <div
                  style={{
                    backgroundColor: "#dd4f05",
                    fontWeight: "600",
                    color: "#fff"
                  }}
                  className="card-header"
                >
                  <h3>Did you know?</h3>
                </div>
                <div className="card-body">
                  <p style={{ textAlign: "center" }}>
                    Saving ₦500.00 everyday for 90 days can actually win you a
                    weekend treat to your preferred location in Lagos, Kano,
                    Calabar, Abuja{" "}
                  </p>
                  <br />

                  <div style={{ textAlign: "right" }}>
                    <button className="btn btn-primary">Action</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <p>Tips </p>
              <div className="card">
                <div
                  style={{
                    backgroundColor: "#dd4f05",
                    fontWeight: "600",
                    color: "#fff"
                  }}
                  className="card-header"
                >
                  <h3>Hit a round figure</h3>
                </div>
                <div className="card-body">
                  <p style={{ textAlign: "center" }}>Lorem impsum</p>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  littledrops: state.littledrops.littledrops,
  linkedcards: state.cards.linkedcards,
  withdrawfunds: state.littledrops.withdraw,
  dripdrop: state.littledrops.deposit,
  wallet: state.wallet.wallet
});

export default connect(
  mapStateToProps,
  { getLittleD, addLittleD, getLinkedCards, littleWithdraw, littleDrop }
)(LittleDrops);
