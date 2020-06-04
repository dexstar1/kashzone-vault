import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./PlansProgress.css";
import { getRentP } from "../../actions/rentplus";

export class RentplusPlanProgress extends Component {
  static propTypes = {
    getRentP: PropTypes.func.isRequired
  };
  componentDidMount() {
    this.props.getRentP();
  }
  render() {
    return (
      <Fragment>
        <div className="row">
          {this.props.rentplus.map(rentp => (
            <div key={rentp.id} className="col-md-4">
              <div className="plancard">
                <div
                  className="planprogress"
                  style={{ width: `${rentp.percentage_completion}%` }}
                />
                <div className="plancontent">
                  <h3>My rent plus</h3>
                  <p>
                    <strong>Target Amount: </strong> ₦{rentp.target}
                    <br />
                    <small>
                      <strong>
                        Net Payout: ₦
                        {parseFloat(
                          parseInt(rentp.target) + parseInt(rentp.interest)
                        ).toFixed(2)}{" "}
                        (T&C applies)
                      </strong>
                    </small>
                    <br />
                  </p>

                  <p className="planpercentage">
                    {rentp.percentage_completion}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  rentplus: state.rentplus.rentplus
});

export default connect(
  mapStateToProps,
  { getRentP }
)(RentplusPlanProgress);
