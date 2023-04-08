import React from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, XCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";

function Breakers() {
  const url = "/api/breakers";

  const [breakers, setBreakers] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        setBreakers(data);
      });
  }, []);

  function handleDeleteBreaker(breaker) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(breaker),
    };
    fetch("/api/breaker", requestOptions)
      .then((response) => {
        if (!response.ok) {
          toast.error(response.error);
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        // remove from local breakerlist to keep UI in sync
        setBreakers(breakers.filter((b) => b.id != breaker.id));
        toast.success(data.message);
      });
  }

  return (
    <Container className="d-grid gap-1">
      <Row>
        <Col>&nbsp;</Col>
      </Row>
      <Row>
        <Col>
          <h1>Groepen</h1>
        </Col>
        <Col></Col>
      </Row>
      <Row as="h5">
        <Col>Naam</Col>
        <Col>Groep</Col>
        <Col>Fase</Col>
        <Col>Poort</Col>
        <Col>Ampere</Col>
        <Col></Col>
      </Row>
      {breakers &&
        breakers.map((breaker) => {
          return (
            <Row key={breaker.id}>
              <Col>{breaker.name}</Col>
              <Col>{breaker.space}</Col>
              <Col>{breaker.phase_id}</Col>
              <Col>{breaker.port}</Col>
              <Col>{breaker.size_amps}</Col>
              <Col>
                <Link to={"/breakerform/" + breaker.id}>
                  <Button variant="warning">
                    <Pencil size="16" />
                  </Button>
                </Link>
                &nbsp;
                <Link to="/breakers">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteBreaker(breaker)}
                  >
                    <XCircle size="16" />
                  </Button>
                </Link>
              </Col>
            </Row>
          );
        })}
      <Row>
        <Col>
          <Link to={"/breakerform/new"}>
            <Button>New</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Breakers;
