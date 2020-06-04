import React, { Component, Fragment } from "react";
import Cards from "./Card";
import Activity from "./Activity";

export class Dashboard extends Component {
  render() {
    return (
      <Fragment>
        <Cards />
        <br />
        <Activity />
      </Fragment>
    );
  }
}

export default Dashboard;
