import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { faUniversity } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addBank } from "../../../actions/banks";
import { verifyAccount } from "../../../actions/loanprofile";

export class Bank extends Component {
  constructor() {
    super();
    this.state = {
      fullName: "",
      disableButton: true
    };
  }

  static propTypes = {
    verifyAccount: PropTypes.func.isRequired,
    altToggle: PropTypes.func.isRequired
  };

  //Handle Field Change
  setName = value => {
    this.setState({ fullName: value, disableButton: false });
  };

  componentDidUpdate(prevProps) {
    const { verifyaccount } = this.props;
    const { bankName, bankAccount, fullName } = this.props.values;
    const response = { verifyaccount };
    const response2 = { bankName, bankAccount, fullName };
    if (response.verifyaccount.length === 0) {
      if (
        response2.bankName.length === 3 &&
        response2.bankAccount.length === 10
      ) {
        this.props.verifyAccount(bankName, bankAccount);

        //console.log(bankName, bankAccount);
        //console.log(this.props);
      }
    } else if (response.verifyaccount.length >= 1) {
      if (
        response.verifyaccount[response.verifyaccount.length - 1].status !==
        true
      ) {
        if (
          bankAccount !== prevProps.values.bankAccount ||
          bankName !== prevProps.values.bankName
        ) {
          if (
            response2.bankName.length === 3 &&
            response2.bankAccount.length === 10
          ) {
            //console.log("try again");
            this.props.verifyAccount(bankName, bankAccount);
          }
        }
      } else if (
        response.verifyaccount[response.verifyaccount.length - 1].status ===
        true
      ) {
        this.props.values.fullName =
          response.verifyaccount[
            response.verifyaccount.length - 1
          ].data.account_name;
        if (
          bankAccount !== prevProps.values.bankAccount ||
          bankName !== prevProps.values.bankName
        ) {
          if (
            response2.bankName.length === 3 &&
            response2.bankAccount.length === 10
          ) {
            this.props.verifyAccount(bankName, bankAccount);
          }
        }
        if (fullName !== prevProps.values.fullName) {
          this.setName(this.props.values.fullName);
        }
      }

      //console.log(this.props);
      //this.props.verifyAccount(bankName, bankAccount);
    }
  }

  updateProfile = e => {
    e.preventDefault();
    const { bankName, bankAccount, fullName } = this.props.values;
    const body = {
      bank_name: bankName,
      bank_account: bankAccount,
      full_name: fullName
    };
    this.props.addBank(body);
    this.props.altToggle();
  };

  render() {
    const { values, handleChange } = this.props;

    return (
      <div>
        <Fragment>
          <div className="container">
            <article className="card">
              <div className="card-body p-5">
                <h3 className="text-center">
                  {" "}
                  <FontAwesomeIcon icon={faUniversity} /> Add Bank Account{" "}
                </h3>
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="nav-tab-card">
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label htmlFor="cardname">Bank Name</label>
                        <select
                          onChange={handleChange("bankName")}
                          className="form-control"
                          value={values.bankName}
                        >
                          <option value="" />
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
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="bankAccount">Account Number</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            name="cardno"
                            value={values.bankAccount}
                            placeholder="0695951029"
                            onChange={handleChange("bankAccount")}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardNumber">Full Name</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            readOnly
                            value={values.fullName}
                            onChange={handleChange("fullName")}
                          />
                        </div>
                      </div>

                      <button
                        disabled={this.state.disableButton}
                        className="subscribe btn btn-primary btn-block"
                        type="submit"
                        onClick={this.updateProfile}
                      >
                        {" "}
                        Confirm{" "}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  verifyaccount: state.loanprofile.verifyaccount
});

export default connect(
  mapStateToProps,
  { verifyAccount, addBank }
)(Bank);
