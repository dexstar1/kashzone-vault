import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./PlansProgress.css";
import { getTargetS } from "../../actions/targetsavings";

export class TargetPlanProgress extends Component {
  static propTypes = {
    getTargetS: PropTypes.func.isRequired
  };
  componentDidMount() {
    this.props.getTargetS();
  }
  render() {
    return (
      <Fragment>
        <div className="row">
          {this.props.targetsavings.map(targets => (
            <div key={targets.id} className="col-md-4">
              <div className="plancard">
                <div
                  className="planprogress"
                  style={{ width: `${targets.percentage_completion}%` }}
                />
                <div className="plancontent">
                  <h3>{targets.custom_name}</h3>
                  <p>
                    <strong>Target Amount: </strong> ₦{targets.target}
                    <br />
                    <small>
                      <strong>
                        Net Payout: ₦
                        {parseFloat(
                          parseInt(targets.target) + parseInt(targets.interest)
                        ).toFixed(2)}{" "}
                        (T&C applies)
                      </strong>
                    </small>
                    <br />
                  </p>

                  <p className="planpercentage">
                    {targets.percentage_completion}%
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
  targetsavings: state.targetsavings.targetsavings
});

export default connect(
  mapStateToProps,
  { getTargetS }
)(TargetPlanProgress);
