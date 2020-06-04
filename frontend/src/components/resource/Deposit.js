import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Form, Field } from "react-final-form";
import { Form as Formstrap } from "reactstrap";
import { Col, Button, FormGroup, Label, Input, Alert } from "reactstrap";
import { depositFund } from "../../actions/deposit";
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
export class Deposit extends Component {
  constructor() {
    super();
    this.state = {
      disabled: true,
      funderrorVisible: false,
      cardlinkError: false,
      depositSuccess: false
    };
  }
  onSubmit = async values => {
    //console.log(JSON.stringify(values, 0, 2));
    //console.log("value: " + values["sendFund"]);
    this.setState({
      disabled: true
    });
    const body = {
      send_fund: values["sendFund"],
      amount: values["amount"]
    };

    this.props.depositFund(body);
  };
  onDismiss = id => {
    if (id === "cardlinkError") {
      this.setState({
        cardlinkError: false
      });
    } else if (id === "errorVisible") {
      this.setState({
        errorVisible: false
      });
    } else if (id === "depositSuccess") {
      this.setState({
        depositSuccess: false
      });
    }
  };
  componentDidMount() {
    this.props.getLinkedCards();
  }

  componentDidUpdate(prevProps) {
    const { linkedcards } = this.props;
    const { deposit } = this.props;
    const response = { deposit };

    if (this.props.linkedcards !== prevProps.linkedcards) {
      if (this.props.linkedcards.length === 1) {
        this.setState({
          disabled: false
        });
      } else {
        this.setState({
          cardlinkError: true
        });
      }
    }
    if (this.props.deposit !== prevProps.deposit) {
      if (deposit.length !== prevProps.deposit.length) {
        if (deposit[deposit.length - 1]) {
          if (
            response.deposit[response.deposit.length - 1].status === "success"
          ) {
            this.setState({
              depositSuccess: true
            });
          } else {
            this.setState({
              errorVisible: true
            });
          }
        }
      }
    }
  }
  static propTypes = {
    deposit: PropTypes.array.isRequired,
    depositFund: PropTypes.func.isRequired,
    getLinkedCards: PropTypes.func.isRequired
  };
  render() {
    return (
      <Fragment>
        <section id="cover">
          <div className="card p-1 shadow p-4 mb-4 bg-white">
            <h2 className="text-center">
              <strong>Deposit</strong>
            </h2>

            <div className="container">
              <div className="row">
                <div className="col-sm-8 offset-sm-2 text-center">
                  <Alert
                    color="danger"
                    isOpen={this.state.funderrorVisible}
                    toggle={() => this.onDismiss("errorVisible")}
                  >
                    <strong>
                      Unable to process request, be sure card is funded
                    </strong>
                  </Alert>
                  <Alert
                    color="danger"
                    isOpen={this.state.cardlinkError}
                    toggle={() => this.onDismiss("cardlinkError")}
                  >
                    <strong>Please add a debit card before prodeeding</strong>
                  </Alert>
                  <Alert
                    color="success"
                    isOpen={this.state.depositSuccess}
                    toggle={() => this.onDismiss("depositSuccess")}
                  >
                    <h4 className="alert-heading">Well done!</h4>
                    <p>Your Vault Wallet has been credited.</p>
                  </Alert>
                  <Form
                    onSubmit={this.onSubmit}
                    initialValues={{ sendFund: true }}
                    validate={values => {
                      const errors = {};
                      if (!values.amount) {
                        errors.amount = "Required";
                      }
                      return errors;
                    }}
                  >
                    {({ handleSubmit, form, submitting, pristine, values }) => (
                      <Formstrap onSubmit={handleSubmit}>
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
                              value="debitCard"
                            >
                              <option value="debitCard">Debit Card</option>
                            </Field>
                            <Error name="source" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <div className="col text-center">
                            <Button
                              className="btn btn-primary"
                              type="submit"
                              disabled={this.state.disabled}
                            >
                              Continue
                            </Button>{" "}
                            <Button
                              className="btn btn-primary"
                              onClick={form.reset}
                              type="button"
                              disabled={this.state.disabled}
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
  linkedcards: state.cards.linkedcards,
  deposit: state.deposit.deposit
});

export default connect(
  mapStateToProps,
  { depositFund, getLinkedCards }
)(Deposit);
