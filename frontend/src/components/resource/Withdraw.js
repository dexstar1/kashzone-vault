import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bank from "../vaultrudiments/delicates/Bank";

import { getLinkedBank, makeWithdraw } from "../../actions/banks";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Modal } from "react-bootstrap";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export class Withdraw extends Component {
  constructor() {
    super();
    this.state = {
      isHidden: true,
      bankLinked: false,
      bankName: "",
      bankAccount: "",
      fullName: "",
      content: "Add a New Bank",
      showBank: false,
      hiddenSpinner: true,
      modalShow: false,
      withdrawalAmount: "",
      hideForm: false,
      hideBreakdown: true,
      withdrawalBreakdown: "",
      hiddenSpinner2: true,
      withdrawSuccess: false,
      hideWithdrawButton: false
    };
  }

  static propTypes = {
    getLinkedBank: PropTypes.func.isRequired,
    makeWithdraw: PropTypes.func.isRequired
  };

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  altToggle = () => {
    this.setState({
      isHidden: true
    });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  componentDidMount() {
    this.props.getLinkedBank();
    this.setState({
      hiddenSpinner: false
    });
  }

  componentDidUpdate(prevProps) {
    const { banks, withdraw } = this.props;
    const response = { banks, withdraw };
    if (this.props.banks !== prevProps.banks) {
      if (response.banks[0]) {
        if (
          response.banks[0].bank_name !== "" &&
          response.banks[0].bank_account !== ""
        ) {
          this.setState({
            showBank: true,
            hiddenSpinner: true,
            content: "Edit Bank details",
            fullName: response.banks[0].full_name,
            bankName: response.banks[0].bank_name,
            bankAccount: response.banks[0].bank_account
          });
        } else if (
          response.banks[0].bank_name === "" ||
          response.banks[0].bank_account === ""
        ) {
          this.setState({
            showBank: false,
            hiddenSpinner: true,
            content: "Add a New Bank"
          });
        }
      }
    }
    if (this.props.withdraw !== prevProps.withdraw) {
      if (response.withdraw[0].status == "success") {
        this.setState({
          hiddenSpinner2: true,
          hideBreakdown: true,
          withdrawSuccess: true
        });
      }
    }
  }

  getBankName = code => {
    if (code == "044") return "Access Bank";
    if (code == "063") return "Access Bank Diamond";
    if (code == "050") return "Ecobank";
    if (code == "070") return "Fidelity Bank";
    if (code == "011") return "First Bank";
    if (code == "214") return "FCMB";
    if (code == "058") return "GTB";
    if (code == "030") return "Heritage Bank";
    if (code == "082") return "Keystone";
    if (code == "076") return "Polaris (Skye Bank)";
    if (code == "221") return "Stanbic IBTC";
    if (code == "232") return "Sterling Bank";
    if (code == "032") return "Union Bank";
    if (code == "215") return "Unity Bank";
    if (code == "035") return "Wema Bank";
    if (code == "057") return "Zenith Bank";
  };

  modalClose = () => {
    this.setState({
      modalShow: false
    });
  };

  showModal = () => {
    this.setState({
      modalShow: true
    });
  };

  handleWithdrawal = e => {
    const balance = parseInt(this.props.wallet[0][0].balance);
    e.preventDefault();
    if (
      parseInt(this.state.withdrawalAmount) > balance - 50 ||
      parseInt(this.state.withdrawalAmount) < 100
    ) {
      this.setState({
        withdrawalAmount: ""
      });
    } else {
      this.setState({
        hideForm: true,
        hideBreakdown: false,
        withdrawalBreakdown: parseFloat(this.state.withdrawalAmount) + 50
      });
    }
  };

  handleWithdrawalBreakdown = () => {
    const { withdrawalBreakdown } = this.state;
    console.log("Done");
    this.setState({
      hideWithdrawButton: true,
      hiddenSpinner2: false
    });
    const body = { send_fund: true, amount: withdrawalBreakdown };
    this.props.makeWithdraw(body);
  };

  render() {
    const { bankName, bankAccount, fullName } = this.state;
    const values = {
      bankName,
      bankAccount,
      fullName
    };

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
              Withdraw to bank
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form hidden={this.state.hideForm} onSubmit={this.handleWithdrawal}>
              <div className="form-group">
                <input
                  required
                  type="number"
                  placeholder="Enter amount"
                  className="form-control"
                  value={this.state.withdrawalAmount}
                  onChange={this.handleChange("withdrawalAmount")}
                />
                <small style={{ color: "#0f6d1e" }}>Service charge: #50</small>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm
                </button>
              </div>
            </form>
            <div hidden={this.state.hideBreakdown}>
              <table border="0" style={{ margin: "0 auto" }}>
                <tbody>
                  <tr>
                    <th>Amount:</th>
                    <td>₦{this.state.withdrawalAmount}</td>
                  </tr>
                  <tr>
                    <th>Service Charge:</th>
                    <td>₦50.00</td>
                  </tr>
                  <tr>
                    <th>Total:</th>
                    <td>₦{this.state.withdrawalBreakdown}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: "10px" }} className="text-center">
                <button
                  hidden={this.state.hideWithdrawButton}
                  onClick={this.handleWithdrawalBreakdown}
                  className="btn btn-primary btn-small"
                >
                  Withdraw
                </button>
                <CircularProgress
                  hidden={this.state.hiddenSpinner2}
                  disableShrink
                />
              </div>
            </div>
            <div hidden={!this.state.withdrawSuccess} className="text-center">
              <FontAwesomeIcon size="2x" color="#0e4717" icon={faCheck} />
              <br />
              <h2>Transfer successful</h2>
              <br />
              <FontAwesomeIcon size="2x" color="#0e4717" icon={faThumbsUp} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <p>Takes less than a minute</p>
          </Modal.Footer>
        </Modal>
        <div>
          <strong>Linked Bank account </strong>
        </div>
        <br />
        <div hidden={!this.state.showBank} className="container">
          <div
            style={{ fontSize: "1.4em" }}
            className="card card-body col-md-4"
          >
            {this.state.fullName}
            <br />
            <b>{this.getBankName(this.state.bankName)}</b>
            <b>{this.state.bankAccount} </b>
            <br />
            <button
              onClick={() => this.showModal()}
              className="btn btn-primary btn-sm"
            >
              Withdraw
            </button>
          </div>
        </div>
        <div className="text-center">
          <CircularProgress hidden={this.state.hiddenSpinner} disableShrink />
        </div>
        <br />
        <div className="container">
          <a
            style={{ textDecoration: "None", color: "blue", cursor: "pointer" }}
            onClick={this.toggleHidden.bind(this)}
          >
            <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} />{" "}
            {this.state.content}
          </a>
        </div>
        <hr />
        {!this.state.isHidden && (
          <Bank
            values={values}
            handleChange={this.handleChange}
            altToggle={this.altToggle}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  banks: state.banks.banks,
  wallet: state.wallet.wallet,
  withdraw: state.banks.withdraw
});

export default connect(
  mapStateToProps,
  { getLinkedBank, makeWithdraw }
)(Withdraw);
