import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getActivity } from "../../actions/activity";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge } from "reactstrap";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faSmileWink } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Activity extends Component {
  constructor() {
    super();
    this.state = {
      hideMoreIcon: true,
      hideWelcomeMessage: true
    };
  }
  static propTypes = {
    activity: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.getActivity();
  }

  componentDidUpdate(prevProps) {
    const { activity } = this.props;
    if (this.props.activity !== prevProps.activity) {
      if (activity.length === 10) {
        this.setState({
          hideMoreIcon: false
        });
      }
      if (activity.length <= 2) {
        this.setState({
          hideWelcomeMessage: false
        });
      }
    }
  }

  render() {
    const getBadgeColor = {
      DEPOSIT: "primary",
      RECEIVE: "primary",
      CREATED: "secondary",
      TRANSFER: "danger",
      WITHDRAW: "danger",
      "LOAN-CR": "primary",
      "LOAN-DR": "danger",
      "LITTLE-CR": "primary",
      "LITTLE-DR": "danger",
      "RENTP-CR": "primary",
      "RENTP-DR": "danger",
      "TARGET-CR": "primary",
      "TARGET-DR": "danger",
      "FIXED-CR": "primary",
      "FIXED-DR": "danger",
      "KAPITAL-CR": "primary",
      "KAPITAL-DR": "danger"

      //Vault24 products will be added later
    };

    const { user } = this.props;
    const BadgeColor = type => {
      return getBadgeColor[type];
    };

    return (
      <Fragment>
        <h2>Activity Log</h2>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {this.props.activity.map(activ => (
              <tr key={activ.id}>
                <td>{activ.timestamp}</td>
                <td>
                  <Badge color={BadgeColor(activ.ttype)} pill>
                    {activ.ttype}
                  </Badge>
                </td>
                <td>₦{activ.delta}</td>
                <td>₦{activ.debug_balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          hidden={this.state.hideMoreIcon}
          style={{
            color: "#dd4f05",
            cursor: "pointer",
            marginTop: "20px",
            textAlign: "right",
            fontWeight: "1200",
            display: "inline"
          }}
        >
          <h5>
            View more <FontAwesomeIcon icon={faArrowAltCircleRight} />
          </h5>
        </div>
        <div
          hidden={this.state.hideWelcomeMessage}
          style={{ marginTop: "30px" }}
          className="text-center"
        >
          <h3>
            Welcome {user.fullname.split(" ")[0]}. Your vault saving, investment
            and transaction history will be displayed here.
            <br />
            <br /> Accept vault's special green wink. You're highly welcome to
            Vault24.
          </h3>
          <FontAwesomeIcon color="green" icon={faSmileWink} size="5x" />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  activity: state.activity.activity,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getActivity }
)(Activity);
