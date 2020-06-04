import React, { Component } from "react";
import { Link } from "react-router-dom";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import Button from "@material-ui/core/Button";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Success extends Component {
  render() {
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
                title="Success"
              />
              <br />
              <div style={{ paddingTop: "50px" }}>
                <FontAwesomeIcon size="3x" color="#0e4717" icon={faCheck} />
                <br />
                <h2>Your Loan Application has been submitted</h2>
                <h4>Your requested amount will be disbursed shortly</h4>
                <br />
                <FontAwesomeIcon size="3x" color="#0e4717" icon={faThumbsUp} />

                <br />
                <br />

                <Link style={{ color: "blue", textDecoration: "None" }} to="/">
                  <Button
                    variant="contained"
                    component="span"
                    className="button"
                  >
                    Go home
                  </Button>
                </Link>
              </div>
            </React.Fragment>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Success;
