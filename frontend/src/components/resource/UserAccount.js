import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link } from "react-router-dom";
import { getPlans, liquidatePlan } from "../../actions/accountcontrol";
import { getProfile, postProfile } from "../../actions/regvalidate";

export class UserAccount extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1",
      fullname: "",
      primaryEmail: "",
      phoneNumber: "",
      gender: "",
      incomeRange: "",
      employmentStatus: "",
      relationshipStatus: "",
      birthday: "",
      disableSaveButton: true
    };
  }

  static propTypes = {
    getPlans: PropTypes.func.isRequired,
    liquidatePlan: PropTypes.func.isRequired,
    getProfile: PropTypes.func.isRequired,
    postProfile: PropTypes.func.isRequired
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    this.props.getProfile(true);
    this.props.getPlans();
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile !== prevProps.profile) {
      this.setState({
        fullname: this.props.profile[0].full_name,
        primaryEmail: this.props.profile[0].primary_email,
        phoneNumber: this.props.profile[0].phone_number,
        gender: this.props.profile[0].gender,
        incomeRange: this.props.profile[0].income_range,
        employmentStatus: this.props.profile[0].employment_status,
        relationshipStatus: this.props.profile[0].relationship_status,
        birthday: this.props.profile[0].birthday
      });
    }
  }

  handleLiquidate = (plan_name, ref_number) => {
    console.log(plan_name, ref_number);
    this.props.liquidatePlan(plan_name, ref_number);
  };

  handleProfileUpdate = e => {
    e.preventDefault();

    this.props.postProfile(
      this.state.primaryEmail,
      this.state.phoneNumber,
      this.state.gender,
      this.state.incomeRange,
      this.state.employmentStatus,
      this.state.relationshipStatus,
      new Date(this.state.birthday)
    );
    this.setState({
      disableSaveButton: true
    });
  };
  onChange = e =>
    this.setState({
      [e.target.name]: e.target.value,
      disableSaveButton: false
    });

  render() {
    const { plans } = this.props;

    return (
      <Fragment>
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: this.state.activeTab === "3" })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                Settings
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <br />
                  <h3>Basic Data Page </h3>

                  <br />
                  <div
                    style={{ overflow: "hidden" }}
                    className="table-responsive"
                  >
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <th>Full name</th>
                          <td>{this.state.fullname}</td>
                        </tr>
                        <tr>
                          <th>Joined</th>
                          <td> ---</td>
                        </tr>
                        <tr>
                          <th>Linked Bank</th>
                          <td>---</td>
                        </tr>
                        <tr>
                          <th>Linked Card</th>
                          <td>---</td>
                        </tr>
                        <tr>
                          <th>Transaction Volume</th>
                          <td>--- transaction(s)</td>
                        </tr>
                        <tr>
                          <th>No. of Referals</th>
                          <td>---</td>
                        </tr>
                        <tr>
                          <th>Last deposit activity</th>
                          <th>---2019 ---</th>
                        </tr>
                        <tr>
                          <th>Last withdrawal activity</th>
                          <th>---2019 ---</th>
                        </tr>

                        <tr>
                          <th>Referral Code</th>
                          <th>AB567023</th>
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <br />
                  <h3>Edit Profile</h3>
                  <br />
                  <form onSubmit={this.handleProfileUpdate}>
                    <div className="form-group form-edit">
                      <p>
                        Wallet ID
                        <input
                          readOnly
                          className="form-control"
                          defaultValue={this.state.phoneNumber}
                        />
                      </p>
                      <p>
                        Primary email
                        <input
                          readOnly
                          className="form-control"
                          defaultValue={this.state.primaryEmail}
                        />
                      </p>
                      <p>
                        Full Name
                        <input
                          readOnly
                          className="form-control"
                          type="text"
                          defaultValue={this.state.fullname}
                        />
                      </p>
                      <p>
                        Gender
                        <select
                          name="gender"
                          onChange={this.onChange}
                          value={this.state.gender}
                          className="form-control"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </p>
                      <p>
                        Income Range
                        <select
                          name="incomeRange"
                          onChange={this.onChange}
                          value={this.state.incomeRange}
                          className="form-control"
                          id=""
                        >
                          <option value="below31k">
                            Below ₦31,000 per month
                          </option>
                          <option value="31-50k">
                            Between ₦31,000 and ₦50,0000
                          </option>
                          <option value="50-80k">
                            Between ₦50,000 and ₦80,0000
                          </option>
                          <option value="80-100k">
                            Between ₦80,000 and ₦100,0000
                          </option>
                          <option value="100-150k">
                            Between ₦100,000 and ₦150,000
                          </option>
                          <option value="250-500k">
                            Between ₦150,000 and ₦250,000
                          </option>
                          <option value="500-1m">
                            Between ₦250,000 and ₦500,000
                          </option>
                          <option>Between ₦500,000 and ₦1,000,000</option>
                          <option value="above1m">Above ₦1,000,000</option>
                        </select>
                      </p>
                      <p>
                        Employment status
                        <select
                          name="employmentStatus"
                          onChange={this.onChange}
                          value={this.state.employmentStatus}
                          className="form-control"
                        >
                          <option value="employed">Employed</option>
                          <option value="selfEmployed">Self-employed</option>
                          <option value="retired">Retired</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="student">Student</option>
                        </select>
                      </p>
                      <p>
                        Relationship status
                        <select
                          name="relationshipStatus"
                          onChange={this.onChange}
                          value={this.state.relationshipStatus}
                          className="form-control"
                        >
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                        </select>
                      </p>
                      <p>
                        Next Birthday
                        <input
                          type="date"
                          defaultValue={this.state.birthday}
                          className="form-control"
                          required
                        />
                      </p>
                    </div>
                    <div>
                      <button
                        disabled={this.state.disableSaveButton}
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  <br />
                  <h3>Account Settings</h3>
                  <br />
                  <div>
                    <ul className="list-group settings">
                      <li className="list-group-item text-muted">
                        Vault Settings
                      </li>
                      <li className="list-group-item">
                        <p>
                          Freeze all outgoing vault transaction{" "}
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </p>
                        <button className="btn btn-primary btn-sm">
                          Take action
                        </button>
                      </li>
                      <li className="list-group-item">
                        <p>
                          Enable signature{" "}
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </p>
                        <button className="btn btn-primary btn-sm">
                          Take action
                        </button>
                      </li>
                      <li className="list-group-item">
                        <p>
                          Logout all sessions{" "}
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </p>
                        <button className="btn btn-primary btn-sm">
                          Take action
                        </button>
                      </li>
                      <li className="list-group-item">
                        <p>
                          Reset password{" "}
                          <i className="fas fa-question-circle" />
                        </p>
                        <button className="btn btn-primary btn-sm">
                          Take action
                        </button>
                      </li>
                    </ul>
                  </div>
                  <hr />

                  <p style={{ float: "left" }}>Running plans</p>
                  <br />

                  <div className="row ">
                    {plans.map(plan =>
                      plan.map(collections => (
                        <div
                          key={collections.ref_number}
                          className="col-sm-6 plan-rows"
                        >
                          <div className="card card-body">
                            <p>
                              {collections.custom_name}

                              <button
                                disabled={
                                  collections.locked == "YES" ? true : false
                                }
                                style={{ float: "right" }}
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  this.handleLiquidate(
                                    collections.plan_name,
                                    collections.ref_number
                                  )
                                }
                              >
                                Liquidate
                              </button>
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  plans: state.accountcontrol.plans,
  profile: state.regvalidate.profile[0]
});

export default connect(
  mapStateToProps,
  { getPlans, liquidatePlan, getProfile, postProfile }
)(UserAccount);
