import React from "react";
import { useState, useEffect } from "react";
import { Form, Container, Button, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "react-bootstrap-icons";
import { toast } from "react-toastify";

function BreakerForm() {
  let { id } = useParams();

  const url = "/api/breaker";

  const [breaker, setBreaker] = useState(); //load default breaker
  const [name, setName] = useState();
  const [space, setSpace] = useState();
  const [port, setPort] = useState();
  const [phaseId, setPhaseId] = useState();
  const [sizeAmps, setSizeAmps] = useState();

  const [hub, setHub] = useState();

  const maxPorts = 15;
  const ports = [];
  for (let i = 1; i <= maxPorts; i++) {
    ports.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const maxSpaces = 15;
  const spaces = [];
  for (let i = 1; i <= maxSpaces; i++) {
    spaces.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const maxPhases = 3;
  const phases = [];
  for (let i = 1; i <= maxPhases; i++) {
    phases.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  useEffect(() => {
    if (id !== "new") {
      fetch(url + "?" + new URLSearchParams({ id: id }).toString())
        .then((response) => {
          if (!response.ok) {
            console.error(response.error);
          }
          return response.json();
        })
        .then((data) => {
          setBreaker(data);
        });
    } else {
      setBreaker({
        name: "new",
        port: 1,
        space: 1,
        size_amps: 30,
        phase_id: 1,
      });
    }

    fetch("/api/hub")
      .then((response) => {
        if (!response.ok) {
          console.error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        setHub(data);
      });
  }, []);

  useEffect(() => {
    if (breaker !== undefined) {
      setName(breaker.name);
      setPhaseId(breaker.phase_id);
      setPort(breaker.port);
      setSpace(breaker.space);
      setSizeAmps(breaker.size_amps);
    }
  }, [breaker]);

  function saveBreaker() {
    breaker.name = name;
    breaker.space = parseInt(space);
    breaker.port = parseInt(port);
    breaker.size_amps = parseInt(sizeAmps);
    breaker.phase_id = parseInt(phaseId);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(breaker),
    };
    fetch(url + (id === "new" ? "/new" : ""), requestOptions)
      .then((response) => {
        if (!response.ok) {
          toast.error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
      });
  }

  return (
    <>
      {breaker && (
        <Container style={{ textAlign: "left" }}>
          <Row>
            <Col>
              <Link to="/breakers">
                <Button variant="secondary">
                  <ArrowLeft size="20" />
                  Terug
                </Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <h1>Groep configuratie</h1>
            </Col>
            <Col></Col>
          </Row>
          <form>
            <Row>
              <Col>Naam</Col>
              <Col>
                {name && (
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Groep nummer</Form.Label>
              </Col>
              <Col>
                {space && (
                  <Form.Select
                    value={space}
                    onChange={(e) => setSpace(e.target.value)}
                  >
                    {spaces}
                  </Form.Select>
                )}
              </Col>
            </Row>
            {hub && hub.phases.length == 3 && (
              <Row>
                <Col>
                  <Form.Label>Fase</Form.Label>
                </Col>
                <Col>
                  {phaseId && (
                    <Form.Select
                      value={phaseId}
                      onChange={(e) => setPhaseId(e.target.value)}
                    >
                      {phases}
                    </Form.Select>
                  )}
                </Col>
              </Row>
            )}
            <Row>
              <Col>Poort</Col>
              <Col>
                {port && (
                  <Form.Select
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                  >
                    {ports}
                  </Form.Select>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Ampère</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={sizeAmps}
                  onChange={(e) => setSizeAmps(e.target.value)}
                >
                  <option value="30">30</option>
                  <option value="50">50</option>
                </Form.Select>
              </Col>
            </Row>

            <Row>
              <Col>&nbsp;</Col>
            </Row>

            <Link to="/breakers">
              <Button variant="success" onClick={saveBreaker}>
                <Check size={30} />
                Save
              </Button>
            </Link>
          </form>
        </Container>
      )}
    </>
  );
}
export default BreakerForm;
