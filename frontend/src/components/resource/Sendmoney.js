import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Form, Field } from "react-final-form";
import { Form as Formstrap } from "reactstrap";
import { Col, Button, FormGroup, Label, Input } from "reactstrap";

import { Modal } from "react-bootstrap";

import CircularProgress from "@material-ui/core/CircularProgress";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { verifyAccount } from "../../actions/loanprofile";
import { verifyVault, makeTransfer } from "../../actions/transfers";
import { getLinkedCards } from "../../actions/cards";

const Error = ({ name }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { error, touched } }) =>
      error && touched ? <span>{error}</span> : null
    }
  </Field>
);

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);
export class Sendmoney extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      destination: "",
      amount: "",
      source: "",
      walletId: "",
      bankAccountNo: "",
      bankName: "",
      receiverFullname: "",
      serviceCharge: "",
      transferBreakdown: "",
      disableButton: true,
      modalShow: false,
      hideBreakdown: false,
      transactionSuccess: false,
      hideSendButton: false,
      hiddenSpinner: true
    };
  }

  static propTypes = {
    verifyAccount: PropTypes.func.isRequired,
    verifyVault: PropTypes.func.isRequired,
    makeTransfer: PropTypes.func.isRequired
  };

  onSubmit = async values => {
    //console.log(JSON.stringify(values, 0, 2));
    let send_fund = values["sendFund"];
    let destination = values["destination"];
    let amount = values["amount"];
    let source = values["source"];
    let wallet_id = values["walletId"];
    let bank_account = values["bankAccountNo"];
    let bank_name = values["bankName"];

    if (destination === "Bank") {
      this.setState({
        title: "Send to Bank",
        destination: destination,
        serviceCharge: "₦50.00",
        bankName: bank_name,
        bankAccountNo: bank_account,
        amount: amount,
        source: source,
        transferBreakdown: parseFloat(amount) + 50
      });
      this.props.verifyAccount(bank_name, bank_account);
    } else if (destination === "Vault") {
      this.setState({
        title: "Send to Vault Wallet",
        destination: destination,
        serviceCharge: "Free",
        walletId: wallet_id,
        amount: amount,
        source: source,
        transferBreakdown: parseFloat(amount)
      });
      this.props.verifyVault(wallet_id);
    }
    this.showModal();
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

  handleSendBreakdown = () => {
    const balance = parseFloat(this.props.wallet[0][0].balance);
    if (this.state.source == "Vault Wallet") {
      if (parseFloat(this.state.transferBreakdown) > balance) {
        this.modalClose();
        //show errors here==> balance insufficient
      } else {
        const body = {
          send_fund: true,
          destination: this.state.destination,
          amount: this.state.amount,
          source: this.state.source,
          wallet_id: this.state.walletId || "None",
          bank_account: this.state.bankAccountNo || "None",
          bank_name: this.state.bankName || "None",
          full_name: this.state.receiverFullname
        };
        this.props.makeTransfer(body);
        this.setState({
          hideSendButton: true,
          hiddenSpinner: false
        });
      }
    }
    if (this.state.source == "Debit Card") {
      if (this.props.linkedcards.length < 1) {
        this.modalClose();
        //show errors here ==> no cards available
      } else {
        const body = {
          send_fund: true,
          destination: this.state.destination,
          amount: this.state.transferBreakdown,
          source: this.state.source,
          bank_name: this.state.bankName || "None",
          bank_account: this.state.bankAccountNo || "None",
          full_name: this.state.receiverFullname,
          wallet_id: this.state.walletId || "None"
        };
        this.props.makeTransfer(body);
        this.setState({
          hideSendButton: true,
          hiddenSpinner: false
        });
      }
    }
  };

  componentDidMount() {
    this.props.getLinkedCards();
  }
  componentDidUpdate(prevProps) {
    const { verifyaccount, verifyvault, transfers } = this.props;
    const response = { verifyaccount, verifyvault, transfers };

    if (this.props.verifyaccount !== prevProps.verifyaccount) {
      if (response.verifyaccount.length >= 1) {
        if (
          response.verifyaccount[response.verifyaccount.length - 1].status ===
          true
        ) {
          this.setState({
            receiverFullname:
              response.verifyaccount[response.verifyaccount.length - 1].data
                .account_name,
            disableButton: false
          });
        }
      }
    }
    if (this.props.verifyvault !== prevProps.verifyvault) {
      if (response.verifyvault.length >= 1) {
        if (
          response.verifyvault[response.verifyvault.length - 1].status === "ok"
        ) {
          this.setState({
            receiverFullname:
              response.verifyvault[response.verifyvault.length - 1].fullName,
            disableButton: false
          });
        }
      }
    }
    if (this.props.transfers !== prevProps.transfers) {
      if (response.transfers[0].status == "success") {
        this.setState({
          hiddenSpinner: true,
          hideBreakdown: true,
          transactionSuccess: true
        });
      }
    }
  }
  render() {
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
              {this.state.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div hidden={this.state.hideBreakdown}>
              <p>
                {" "}
                You are making a transfer to:{" "}
                <b>{this.state.receiverFullname}</b>{" "}
              </p>
              <table border="0" style={{ margin: "0 auto" }}>
                <tbody>
                  <tr>
                    <th>Amount:</th>
                    <td>₦{this.state.amount}</td>
                  </tr>
                  <tr>
                    <th>Service Charge:</th>
                    <td>{this.state.serviceCharge}</td>
                  </tr>
                  <tr>
                    <th>Total:</th>
                    <td>₦{this.state.transferBreakdown}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: "10px" }} className="text-center">
                <button
                  disabled={this.state.disableButton}
                  hidden={this.state.hideSendButton}
                  onClick={this.handleSendBreakdown}
                  className="btn btn-primary btn-small"
                >
                  Send
                </button>
                <CircularProgress
                  hidden={this.state.hiddenSpinner}
                  disableShrink
                />
              </div>
            </div>
            <div
              hidden={!this.state.transactionSuccess}
              className="text-center"
            >
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
        <section id="cover">
          <div className="card p-1 shadow p-4 mb-4 bg-white">
            <h2 className="text-center">
              <strong>Send Money</strong>
            </h2>
            <div className="container">
              <div className="row">
                <div className="col-sm-8 offset-sm-2 text-center">
                  <Form
                    onSubmit={this.onSubmit}
                    initialValues={{ sendFund: true }}
                    validate={values => {
                      const errors = {};
                      if (!values.destination) {
                        errors.destination = "Required";
                      }
                      if (values.destination === "Bank") {
                        if (!values.bankAccountNo) {
                          errors.bankAccountNo = "Required";
                        }
                        if (!values.bankName) {
                          errors.bankName = "Required";
                        }
                      } else if (values.destination === "Vault") {
                        if (!values.walletId) {
                          errors.walletId = "Required";
                        }
                      }
                      if (!values.amount) {
                        errors.amount = "Required";
                      }
                      return errors;
                    }}
                  >
                    {({ handleSubmit, form, submitting, pristine, values }) => (
                      <Formstrap onSubmit={handleSubmit}>
                        <FormGroup row>
                          <Label for="select" sm={2}>
                            Destination:{" "}
                          </Label>
                          <Col>
                            <Field
                              name="destination"
                              component="select"
                              className="browser-default custom-select"
                            >
                              <option />
                              <option value="Bank">Bank</option>
                              <option value="Vault">Vault</option>
                            </Field>
                            <Error name="destination" />
                          </Col>
                        </FormGroup>
                        <Condition when="destination" is="Bank">
                          <FormGroup row>
                            <Label sm={2}>Account No:</Label>
                            <Col>
                              <Field
                                name="bankAccountNo"
                                component="input"
                                type="text"
                                className="form-control"
                              />
                              <Error name="bankAccountNo" />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label sm={2}>Bank Name:</Label>
                            <Col>
                              <Field
                                name="bankName"
                                component="select"
                                className="form-control"
                              >
                                <option />
                                <option value="044">Access Bank</option>
                                <option value="063">Access Bank Diamond</option>
                                <option value="050">Ecobank</option>
                                <option value="070">Fidelity Bank</option>
                                <option value="011">First Bank</option>
                                <option value="214">FCMB</option>
                                <option value="058">GTB</option>
                                <option value="030">Heritage Bank</option>
                                <option value="082">Keystone</option>
                                <option value="076">Polaris (Skye Bank)</option>
                                <option value="221">Stanbic IBTC</option>
                                <option value="232">Sterling Bank</option>
                                <option value="032">Union Bank</option>
                                <option value="215">Unity Bank</option>
                                <option value="035">Wema Bank</option>
                                <option value="057">Zenith Bank</option>
                              </Field>
                              <Error name="bankName" />
                            </Col>
                          </FormGroup>
                        </Condition>
                        <Condition when="destination" is="Vault">
                          <FormGroup row>
                            <Label sm={2}>Wallet ID:</Label>
                            <Col>
                              <Field
                                name="walletId"
                                component="input"
                                type="text"
                                className="form-control"
                              />
                              <Error name="walletId" />
                            </Col>
                          </FormGroup>
                        </Condition>
                        <FormGroup row>
                          <Label sm={2}>Amount:</Label>
                          <Col>
                            <Field
                              name="amount"
                              component="input"
                              type="text"
                              className="form-control"
                            />
                            <Error name="amount" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm={2}>Source:</Label>
                          <Col>
                            <Field
                              name="source"
                              component="select"
                              className="form-control"
                            >
                              <option />
                              <option>Debit Card</option>
                              <option>Vault Wallet</option>
                            </Field>
                            <Error name="amount" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <div className="col text-center">
                            <Button
                              className="btn btn-primary"
                              type="submit"
                              disabled={submitting}
                            >
                              Continue
                            </Button>{" "}
                            <Button
                              className="btn btn-primary"
                              onClick={form.reset}
                              type="button"
                              disabled={submitting}
                            >
                              Cancel
                            </Button>
                          </div>
                        </FormGroup>
                      </Formstrap>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  verifyaccount: state.loanprofile.verifyaccount,
  verifyvault: state.transfers.walletverify,
  transfers: state.transfers.transfers,
  wallet: state.wallet.wallet,
  linkedcards: state.cards.linkedcards
});

export default connect(
  mapStateToProps,
  { verifyAccount, verifyVault, getLinkedCards, makeTransfer }
)(Sendmoney);
