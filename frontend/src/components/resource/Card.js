import React, { Component, Fragment } from "react";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const cardStyle = {
  borderRadius: 10
};

export class Cards extends Component {
  render() {
    return (
      <CardDeck>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>
              <strong>Little Drops</strong>
            </Card.Title>
            <Card.Text>Save as little; Earn as much.</Card.Text>
            <Link to="/vault/littledrops">
              <Button className="btn-primary" variant="success">
                Get Started
              </Button>
            </Link>
          </Card.Body>
        </Card>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>
              <strong>Rent Plus</strong>
            </Card.Title>
            <Card.Text>Save now; get your next rent sorted out.</Card.Text>
            <Link to="/vault/rentplus">
              <Button className="btn-primary" variant="success">
                Get Started
              </Button>
            </Link>
          </Card.Body>
        </Card>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>
              <strong>Target Savings</strong>
            </Card.Title>
            <Card.Text>
              Save and earn. Get up to 10% per annum on target.{" "}
            </Card.Text>
            <Link to="/vault/targets">
              <Button className="btn-primary" variant="success">
                Get Started
              </Button>
            </Link>
          </Card.Body>
        </Card>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>
              <strong>Fixed Deposit</strong>
            </Card.Title>
            <Card.Text>Fix funds & be rewarded like a King.</Card.Text>
            <Link to="/vault/fixed">
              <Button className="btn-primary" variant="success">
                Get Started
              </Button>
            </Link>
          </Card.Body>
        </Card>
        <Card style={cardStyle}>
          <Card.Body>
            <Card.Title>
              <strong>Kapital</strong>
            </Card.Title>
            <Card.Text>Drive your business growth with Vault.</Card.Text>
            <Link to="vault/kapital">
              <Button className="btn-primary" variant="success">
                Get Started
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </CardDeck>
    );
  }
}

export default Cards;
