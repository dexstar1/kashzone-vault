import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./credit-card.css";
import { getLinkedCards } from "../../../actions/cards";
var MasterCard = require("../../../assets/mastercard.png");
var Visa = require("../../../assets/visa.png");
var Verve = require("../../../assets/verved.png");

export class DisplayCard extends Component {
  constructor() {
    super();
    this.state = {
      isHidden: true,
      wallet: "",
      cardno: "",
      expirymonth: "",
      expiryyear: "",
      type: "",
      wallet2: "",
      cardno2: "",
      expirymonth2: "",
      expiryyear2: "",
      type2: ""
    };
  }
  componentDidMount() {
    this.props.getLinkedCards();
    console.log(this.state);
  }

  componentDidUpdate(prevProps) {
    const { linkedcards } = this.props;

    if (this.props.linkedcards !== prevProps.linkedcards) {
      if (this.props.linkedcards.length === 1) {
        this.setState({
          isHidden: false,
          wallet: this.props.auth.user.phone_number,
          cardno: "**** **** **** " + linkedcards[0].card_number,
          expirymonth: linkedcards[0].expiry_month,
          expiryyear: linkedcards[0].expiry_year,
          type: linkedcards[0].card_type
        });
      }
    }
  }
  checkLogo = type => {
    if (type === "Mastercard") {
      return MasterCard;
    } else if (type === "Visa") {
      return Visa;
    } else if (type === "Verve") {
      return Verve;
    }
  };
  static propTypes = {
    auth: PropTypes.object.isRequired,
    getLinkedCards: PropTypes.func.isRequired
  };

  render() {
    const { wallet, cardno, expirymonth, expiryyear, type } = this.state;
    const values = { wallet, cardno, expirymonth, expiryyear, type };
    return (
      <div hidden={this.state.isHidden} className="container">
        <br />
        <div className="credit-card">
          <div className="credit-card__logo">
            <img
              className="logo"
              src={this.checkLogo(values.type)}
              width="60px"
            />
          </div>

          <div className="credit-card__number">{values.cardno}</div>

          <div className="credit-card__info">
            <div className="credit-card__info_name">
              <div className="credit-card__info_label">VAULT WALLET</div>
              <div>
                <h3>{values.wallet}</h3>
              </div>
            </div>

            <div className="credit-card__info_expiry">
              <div className="credit-card__info_label">VALID UP TO</div>
              <div>
                {values.expirymonth}/{values.expiryyear}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  linkedcards: state.cards.linkedcards,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getLinkedCards }
)(DisplayCard);
