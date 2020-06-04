import React, { Component, Fragment } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cards from "../vaultrudiments/delicates/Cards";
import DisplayCard from "../vaultrudiments/delicates/DisplayCard";

export class ManageCards extends Component {
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
          <strong>
            Your card details are securely stored using top level security
            provided by Flutterwave Inc.{" "}
          </strong>

          <div>
            <DisplayCard />
          </div>
        </div>
        <br />
        <div className="container">
          <a
            style={{ textDecoration: "None", color: "blue", cursor: "pointer" }}
            onClick={this.toggleHidden.bind(this)}
          >
            <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} /> Add a
            New Card
          </a>
        </div>
        <hr />
        {!this.state.isHidden && <Cards />}
      </Fragment>
    );
  }
}

export default ManageCards;
