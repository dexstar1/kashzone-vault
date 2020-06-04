import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";

import RaisedButton from "material-ui/RaisedButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { verifyAccount, postProfile } from "../../actions/loanprofile";
export class BankDetails extends Component {
  constructor() {
    super();
    this.state = {
      fullName: "",
      helperText: "",
      helperText2: ""
    };
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    verifyAccount: PropTypes.func.isRequired,
    postProfile: PropTypes.func.isRequired
  };
  continue = () => {
    const { user } = this.props.auth;
    if (
      this.props.values.bankName == "" ||
      this.props.values.bankAccount == ""
    ) {
      if (this.props.values.bankName == "") {
        this.setState({ helperText: "Select option" });
      } else if (this.props.values.bankAccount == "") {
        this.setState({ helperText2: "Input needed" });
      }
    } else {
      this.props.postProfile(
        user.email,
        user.phone_number,
        this.props.values.bankName,
        this.props.values.bankAccount,
        this.props.values.fullName
      );
      console.log(this.props);
      this.props.nextStep();
    }
  };
  setName = value => {
    this.setState({ fullName: value });
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

  render() {
    const { values, handleChange } = this.props;

    return (
      <MuiThemeProvider>
        <div className="card p-1 shadow p-4 mb-4 bg-white">
          <div className="col-sm-7 offset-sm-2 text-center">
            <React.Fragment>
              <AppBar
                showMenuIconButton={false}
                style={{
                  backgroundColor: "#fdf7f9",
                  textAlign: "center"
                }}
                titleStyle={{
                  color: "#210f08"
                }}
                title="Bank Details"
              />
              <br />
              <FormControl className="form-control col-sm-5">
                <InputLabel>Bank Name</InputLabel>

                <Select
                  value={values.bankName}
                  onChange={handleChange("bankName")}
                  error={!!this.state.helperText}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="044">Access Bank</MenuItem>
                  <MenuItem value="063">Access Bank Diamond</MenuItem>
                  <MenuItem value="050">Ecobank</MenuItem>
                  <MenuItem value="070">Fidelity Bank</MenuItem>
                  <MenuItem value="011">First Bank</MenuItem>
                  <MenuItem value="214">FCMB</MenuItem>
                  <MenuItem value="058">GTB</MenuItem>
                  <MenuItem value="030">Heritage Bank</MenuItem>
                  <MenuItem value="082">Keystone</MenuItem>
                  <MenuItem value="076">Polaris (Skye Bank)</MenuItem>
                  <MenuItem value="221">Stanbic IBTC</MenuItem>
                  <MenuItem value="232">Sterling Bank</MenuItem>
                  <MenuItem value="032">Union Bank</MenuItem>
                  <MenuItem value="215">Unity Bank</MenuItem>
                  <MenuItem value="035">Wema Bank</MenuItem>
                  <MenuItem value="057">Zenith Bank</MenuItem>
                </Select>
              </FormControl>

              <br />
              <br />

              <TextField
                hintText="Account Number"
                floatingLabelText="Account Number"
                onChange={handleChange("bankAccount")}
                defaultValue={values.bankAccount}
                errorText={this.state.helperText2}
              />
              <br />
              <br />
              <TextField
                disabled
                hintText="Full Name"
                onChange={handleChange("fullName")}
                value={values.fullName}
              />
              <br />
              <br />
              <RaisedButton
                label="Next"
                primary={true}
                style={styles.button}
                onClick={this.continue}
              />
            </React.Fragment>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  button: {
    margin: 15
  }
};

const mapStateToProps = state => ({
  auth: state.auth,
  verifyaccount: state.loanprofile.verifyaccount
});
export default connect(
  mapStateToProps,
  { verifyAccount, postProfile }
)(BankDetails);
