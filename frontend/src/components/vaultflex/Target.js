import React, { Component, Fragment } from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Targetchild from "../vaultrudiments/Target";
import TargetPlanProgress from "../vaultrudiments/TargetPlanProgress";

export class Target extends Component {
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
          <strong>Existing plans</strong>
        </div>
        <TargetPlanProgress />
        <br />
        <div className="container">
          <a
            style={{ textDecoration: "None", color: "blue", cursor: "pointer" }}
            onClick={this.toggleHidden.bind(this)}
          >
            <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} /> Create
            a new plan
          </a>
        </div>
        <hr />
        {!this.state.isHidden && <Targetchild />}
      </Fragment>
    );
  }
}

export default Target;
