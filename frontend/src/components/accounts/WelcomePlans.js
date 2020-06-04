import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal } from "react-bootstrap";
import "../vaultrudiments/Help.css";

export class WelcomePlans extends Component {
  constructor() {
    super();
    this.state = {
      timeline: "90",
      interest: "8837.50",
      totalReturns: "109837.50",
      amountInvested: "101000",
      amountInvestederr: false,
      modalShow: false
    };
    this.amountInvestedRef = React.createRef();
    this.timelineRef = React.createRef();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSlider = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.state.timeline = e.target.value;
  };

  modalClose = () => {
    this.setState({
      modalShow: false
    });
  };

  rateGuideShow = () => {
    this.setState({
      modalShow: true
    });
  };

  onInput = e => {
    var x = parseFloat(this.amountInvestedRef.current.value);
    var y = parseFloat(this.timelineRef.current.value);
    if (x < 101000) {
      this.setState({
        amountInvestederr: true,
        interest: "0.00",
        totalReturns: "0.00"
      });
    }
    if (x >= 101000 && x <= 999999) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30) {
        this.setState({
          interest: parseFloat(0.08 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.08 * x).toFixed(2)
        });
      } else if (y == 60) {
        this.setState({
          interest: parseFloat(0.0825 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.0825 * x).toFixed(2)
        });
      } else if (y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: parseFloat(0.0875 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.0875 * x).toFixed(2)
        });
      } else if (y == 180) {
        this.setState({
          interest: parseFloat(0.09 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.09 * x).toFixed(2)
        });
      }
    }
    if (x >= 999999 && x <= 4900000) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30) {
        this.setState({
          interest: parseFloat(0.09 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.09 * x).toFixed(2)
        });
      } else if (y == 60) {
        this.setState({
          interest: parseFloat(0.1 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.1 * x).toFixed(2)
        });
      } else if (y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: parseFloat(0.11 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.11 * x).toFixed(2)
        });
      } else if (y == 180) {
        this.setState({
          interest: parseFloat(0.12 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.12 * x).toFixed(2)
        });
      }
    }

    if (x >= 5000000 && x <= 9999999) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30) {
        this.setState({
          interest: parseFloat(0.1 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.1 * x).toFixed(2)
        });
      } else if (y == 60) {
        this.setState({
          interest: parseFloat(0.11 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.11 * x).toFixed(2)
        });
      } else if (y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: parseFloat(0.12 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.12 * x).toFixed(2)
        });
      } else if (y == 180) {
        this.setState({
          interest: parseFloat(0.13 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.13 * x).toFixed(2)
        });
      }
    }

    if (x >= 10000000 && x <= 30999999) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30) {
        this.setState({
          interest: parseFloat(0.11 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.11 * x).toFixed(2)
        });
      } else if (y == 60) {
        this.setState({
          interest: parseFloat(0.12 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.12 * x).toFixed(2)
        });
      } else if (y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: parseFloat(0.135 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.135 * x).toFixed(2)
        });
      } else if (y == 180) {
        this.setState({
          interest: parseFloat(0.145 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.145 * x).toFixed(2)
        });
      }
    }

    if (x >= 31000000 && x <= 50999999) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30) {
        this.setState({
          interest: parseFloat(0.12 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.12 * x).toFixed(2)
        });
      } else if (y == 60) {
        this.setState({
          interest: parseFloat(0.13 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.13 * x).toFixed(2)
        });
      } else if (y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: parseFloat(0.14 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.14 * x).toFixed(2)
        });
      } else if (y == 180) {
        this.setState({
          interest: parseFloat(0.15 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.15 * x).toFixed(2)
        });
      }
    }

    if (x >= 51000000 && x <= 100000000) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30) {
        this.setState({
          interest: parseFloat(0.13 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.13 * x).toFixed(2)
        });
      } else if (y == 60) {
        this.setState({
          interest: parseFloat(0.14 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.14 * x).toFixed(2)
        });
      } else if (y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: parseFloat(0.15 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.15 * x).toFixed(2)
        });
      } else if (y == 180) {
        this.setState({
          interest: parseFloat(0.16 * x).toFixed(2),
          totalReturns: parseFloat(x + 0.16 * x).toFixed(2)
        });
      }
    }

    if (x > 100000000) {
      this.setState({
        amountInvestederr: false
      });
      if (y == 30 || y == 60 || y == 90 || y == 120 || y == 150) {
        this.setState({
          interest: "Negotiable",
          totalReturns: "Negotiable"
        });
      }
    }
  };

  render() {
    const { timeline, interest, totalReturns, amountInvested } = this.state;
    return (
      <Fragment>
        <Modal
          show={this.state.modalShow}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={this.modalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Rate Guide
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="form-group rate-guide">
                <p className="rate-control-text">
                  <strong style={{ opacity: "0.5" }}>If you invest</strong>
                </p>
                <span>NGN</span>
                <input
                  id="amount-input"
                  pattern="[0-9]{5}"
                  type="tel"
                  name="amountInvested"
                  onChange={this.onChange}
                  defaultValue={amountInvested}
                  onInput={this.onInput}
                  placeholder="Min 101000"
                  className="form-control"
                  ref={this.amountInvestedRef}
                />
                <div hidden={!this.state.amountInvestederr}>
                  <p className="text-danger text-xs">
                    Amount below mininum investment
                  </p>
                </div>
              </div>
              <div className="form-group rate-guide">
                <p className="text-center">
                  <strong style={{ opacity: "0.5" }}>
                    {timeline} Days (Slide to adjust)
                  </strong>
                </p>
              </div>
              <div className="slider">
                <input
                  type="range"
                  onChange={this.handleSlider}
                  min="30"
                  step="30"
                  max="180"
                  className="slider"
                  defaultValue={timeline}
                  onInput={this.onInput}
                  ref={this.timelineRef}
                />
              </div>
            </div>
            <div className="rate-guide">
              <div style={{ display: "inline-block" }}>
                <p className="result-text">
                  you earn: <br />
                  <strong className="result-strong">NGN {interest}</strong>
                </p>
              </div>
              <div style={{ float: "right" }}>
                <p className="result-text">
                  Total Returns:
                  <br />
                  <strong className="result-strong">NGN {totalReturns}</strong>
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Link style={{ textDecoration: "none" }} to="/vault/fixed">
              <button className="btn btn-primary btn-sm">Select Plan</button>
            </Link>
            <button className="btn btn-danger btn-sm" onClick={this.modalClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <div className="">
          <h2 className="text-center">
            <strong>Welcome to Vault24</strong>
          </h2>
          <br />
          <br />
          <div className="text-center">
            <h4>What plan would you love</h4>
          </div>
          <div className="boxit animated bounceInRight">
            <div className="row">
              <div className="col-sm-3">
                <div className="card">
                  <div className="card-header">
                    <h4>Little Drops</h4>
                  </div>
                  <div className="card-body">
                    <p className="plan-intro">Save as little, Earn as much.</p>
                    <ul>
                      <li>General savings plans</li>
                      <li>Add funds anytime</li>
                      <li>Withdraw funds anytime</li>
                      <li>Earn up to 7% per annum</li>
                    </ul>
                    <br />
                    <br />
                    <br />
                    <br />

                    <Link
                      style={{ textDecoration: "none" }}
                      to="/vault/littledrops"
                    >
                      <button className="btn btn-primary btn-block">
                        Select plan
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card">
                  <div className="card-header">
                    <h4>Rent Plus</h4>
                  </div>
                  <div className="card-body">
                    <p className="plan-intro">Tailored for your next rent.</p>
                    <ul>
                      <li>Tenor of 6 and 12 months</li>
                      <li>Save for 11months, get the 12th as a reward</li>
                      <li>
                        Save 6 months and get 40% of your monthly savings as
                        reward
                      </li>
                      <li>Maximum of N200,000 savings per month</li>
                    </ul>
                    <br />

                    <Link
                      style={{ textDecoration: "none" }}
                      to="/vault/rentplus"
                    >
                      <button className="btn btn-primary btn-block">
                        Select plan
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card">
                  <div className="card-header">
                    <h4>Target Savings</h4>
                  </div>
                  <div className="card-body">
                    <p className="plan-intro">
                      Customizable target savings plan
                    </p>
                    <ul>
                      <li>Save toward your goals</li>
                      <li>Earn up to 10% per annum on savings</li>
                      <li>Get best deals & offers</li>
                    </ul>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/vault/targets"
                    >
                      <button className="btn btn-primary btn-block">
                        Select plan
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card">
                  <div className="card-header">
                    <h4>Fixed Deposit</h4>
                  </div>
                  <div className="card-body">
                    <p className="plan-intro">Tenored deposit account.</p>
                    <ul>
                      <li>Minimum of N100,000.00</li>
                      <li>Earn over 13% interest per month</li>
                    </ul>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <div className="text-center">
                      <button
                        onClick={() => this.rateGuideShow()}
                        className="btn btn-primary btn-sm"
                      >
                        Rate guide
                      </button>
                      &nbsp; &nbsp; &nbsp;
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/vault/fixed"
                      >
                        <button className="btn btn-primary btn-sm">
                          Select plan
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="otherpecks">
          <h4>Other Pecks</h4>
          <hr />
          <ul>
            <li>
              <h5>
                Get access to flat rate loan of 2% interest up to 90 days.
              </h5>
            </li>
            <li>
              <h5>
                Get best deals and offers from partnerd stores and agencies.
              </h5>
            </li>
          </ul>
        </div>
        <div
          style={{
            color: "#dd4f05",
            cursor: "pointer",
            marginTop: "20px",
            textAlign: "right",
            fontWeight: "1200",
            display: "inline"
          }}
        >
          <h4>
            <Link to="/" style={{ textDecoration: "none", color: "#dd4f05" }}>
              Go Home <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </Link>
          </h4>
        </div>
      </Fragment>
    );
  }
}

export default WelcomePlans;
