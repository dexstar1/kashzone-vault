import React, { Component, Fragment } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fixedchild from "../vaultrudiments/Fixed";
import FixedPlanProgress from "../vaultrudiments/FixedPlanProgress";

export class Fixed extends Component {
  constructor() {
    super();
    this.state = {
      isHidden: true
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  render() {
    return (
      <Fragment>
        <div>
          <strong>Existing Investment plans</strong>
        </div>
        <FixedPlanProgress />
        <br />
        <div className="container">
          <a
            style={{ textDecoration: "None", color: "blue", cursor: "pointer" }}
            onClick={this.toggleHidden.bind(this)}
          >
            <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} /> Setup a
            new investment package
          </a>
        </div>
        <hr />
        {!this.state.isHidden && <Fixedchild />}
      </Fragment>
    );
  }
}

export default Fixed;
