import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getFixds } from "../../actions/fixeddeposit";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

export class FixedPlanProgress extends Component {
  static propTypes = {
    getFixds: PropTypes.func.isRequired
  };
  componentDidMount() {
    this.props.getFixds();
  }
  render() {
    return (
      <Fragment>
        <div className="row">
          {this.props.fixeddeposit.map(fixds => (
            <div key={fixds.id} className="col-md-4">
              <Card className="title">
                <CardContent>
                  <h5 style={{ textAlign: "center" }}>{fixds.custom_name}</h5>
                  <table border="0" style={{ margin: "0 auto" }}>
                    <tbody>
                      <tr>
                        <th>Investment amount:</th>
                        <td>₦{fixds.amount_planned}</td>
                      </tr>
                      <tr>
                        <th>Amount deposited:</th>
                        <td>₦{fixds.amount_received}</td>
                      </tr>
                      <tr>
                        <th>
                          Net payout <small>(T&C applies)</small>:
                        </th>
                        <td>
                          ₦
                          {parseFloat(
                            parseInt(fixds.amount_planned) +
                              parseInt(fixds.interest)
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <th>Start date:</th>
                        <td>{new Date(fixds.start_date).toDateString()}</td>
                      </tr>
                      <tr>
                        <th>Maturity date:</th>
                        <td>{new Date(fixds.end_date).toDateString()}</td>
                      </tr>
                      <tr>
                        <th>Investment valid:</th>
                        <td>No</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-center">
                    <small style={{ color: "red" }}>
                      <strong>
                        We've been unable to recieve/process your fund
                      </strong>
                    </small>
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  fixeddeposit: state.fixeddeposit.fixeddeposit
});

export default connect(
  mapStateToProps,
  { getFixds }
)(FixedPlanProgress);
