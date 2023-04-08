import React from "react";
import { useState, useEffect } from "react";
import {
  Stack,
  Form,
  Container,
  Button,
  Row,
  Col,
  TabContent,
} from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function HubForm(props) {
  const factor = 100000000;
  const url = "/api/hub";
  const [hub, setHub] = useState(null); //load empty hub
  const [errors, setErrors] = useState([]);
  const [vcf, setVcf] = useState(1);
  const [pcf, setPcf] = useState(1);
  const [phases, setPhases] = useState(null);
  const [phaseCount, setPhaseCount] = useState(null);
  const [frequency, setFrequency] = useState(50);
  const [mqttBrokerUrl, setMqttBrokerUrl] = useState(null);
  const [mqttUserName, setMqttUserName] = useState(null);
  const [mqttPassword, setMqttPassword] = useState(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const [debug, setDebug] = useState(false);

  const template_1phase = [
    {
      id: 1,
      name: "fase1",
      phase_offset_ns: 0,
    },
  ];
  const template_3phase = [
    {
      id: 1,
      name: "fase1",
      phase_offset_ns: 0,
    },
    {
      id: 2,
      name: "fase2",
      phase_offset_ns: 6666667,
    },
    {
      id: 3,
      name: "fase3",
      phase_offset_ns: 13333333,
    },
  ];

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        setHub(data);
      });
  }, []);

  useEffect(() => {
    if (hub === null) return;
    setVcf(hub.voltage_calibration_factor * factor);
    setPcf(hub.port_calibration_factor * factor);
    setPhases(hub.phases !== null ? hub.phases : "");
    setPhaseCount(hub.phases.length);
    setFrequency(hub.frequency !== null ? hub.frequency : "");
    setMqttBrokerUrl(hub.mqtt_broker_url !== null ? hub.mqtt_broker_url : "");
    setMqttUserName(hub.mqtt_user_name !== null ? hub.mqtt_user_name : "");
    setMqttPassword(hub.mqtt_password !== null ? hub.mqtt_password : "");
    setNeedsCalibration(
      hub.needs_calibration !== undefined ? hub.needs_calibration : false
    );
    setDebug(hub.debug !== undefined ? hub.debug : false);
  }, [hub]);

  function saveHub() {
    hub.voltage_calibration_factor = parseFloat(vcf / factor);
    hub.port_calibration_factor = parseFloat(pcf / factor);
    hub.phases = phases;
    hub.frequency = parseInt(frequency);
    hub.mqtt_broker_url = mqttBrokerUrl;
    hub.mqtt_user_name = mqttUserName;
    hub.mqtt_password = mqttPassword;
    hub.needs_calibration = needsCalibration;
    hub.debug = debug;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hub),
    };
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          toast.error(response);
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
      });
  }

  function _setPhaseCount(value) {
    setPhaseCount(value);
    setPhases(value == 1 ? template_1phase : template_3phase);
  }

  function setPhaseOffset(phaseId, value) {
    const newPhases = phases.map((phase) => {
      if (phase.id == phaseId) {
        return {
          ...phase,
          phase_offset_ns: parseInt(value),
        };
      }
      return phase;
    });
    setPhases(newPhases);
  }

  return (
    <>
      {hub && (
        <Container style={{ textAlign: "left" }}>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <h1>Edit Hub</h1>
            </Col>
            <Col></Col>
          </Row>
          <form>
            <Row>
              <Col>
                <Form.Label>Voltage Calibration Factor</Form.Label>
              </Col>
              <Col>
                <RangeSlider
                  value={vcf === undefined ? 1 : vcf}
                  min={0}
                  max={200000000}
                  tooltipLabel={(currentValue) => currentValue / factor}
                  onChange={(e) => setVcf(e.target.value)}
                />
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Form.Label>Port Calibration Factor</Form.Label>
              </Col>
              <Col>
                <RangeSlider
                  value={pcf === undefined ? 1 : pcf}
                  min={0}
                  max={200000000}
                  tooltipLabel={(currentValue) => currentValue / factor}
                  onChange={(e) => setPcf(e.target.value)}
                />
              </Col>
            </Row> */}
            <Row>
              <Col>
                <Form.Label>Phase count</Form.Label>
              </Col>
              <Col>
                {phaseCount && (
                  <Form.Select
                    value={phaseCount}
                    onChange={(e) => _setPhaseCount(e.target.value)}
                  >
                    <option value="1">1 fase</option>
                    <option value="3">3 fasen</option>
                  </Form.Select>
                )}
              </Col>
            </Row>
            {phaseCount == 3 && (
              <Row>
                <Col>
                  <Form.Label>Phase offset</Form.Label>
                </Col>
                <Col>
                  {phases.map((phase) => {
                    return (
                      <Row key={phase.id}>
                        <Col>{phase.name}</Col>
                        <Col>
                          <Form.Select
                            value={phase.phase_offset_ns}
                            onChange={(e) =>
                              setPhaseOffset(phase.id, e.target.value)
                            }
                          >
                            <option value={template_3phase[0].phase_offset_ns}>
                              {template_3phase[0].phase_offset_ns}
                            </option>
                            <option value={template_3phase[1].phase_offset_ns}>
                              {template_3phase[1].phase_offset_ns}
                            </option>
                            <option value={template_3phase[2].phase_offset_ns}>
                              {template_3phase[2].phase_offset_ns}
                            </option>
                          </Form.Select>
                        </Col>
                      </Row>
                    );
                  })}
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Form.Label>Frequency</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="50">50 Hz</option>
                  <option value="60">60 Hz</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>MQTT broker URL</Form.Label>
              </Col>
              <Col>
                {mqttBrokerUrl !== null && (
                  <Form.Control
                    value={mqttBrokerUrl}
                    onChange={(e) => setMqttBrokerUrl(e.target.value)}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>MQTT Username</Form.Label>
              </Col>
              <Col>
                {mqttUserName !== null && (
                  <Form.Control
                    value={mqttUserName}
                    onChange={(e) => setMqttUserName(e.target.value)}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>MQTT Password</Form.Label>
              </Col>
              <Col>
                {mqttPassword !== null && (
                  <Form.Control
                    type="password"
                    value={mqttPassword}
                    onChange={(e) => setMqttPassword(e.target.value)}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Needs calibration</Form.Label>
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  value={needsCalibration}
                  checked={needsCalibration}
                  onChange={(e) => setNeedsCalibration(e.target.checked)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Debug</Form.Label>
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  value={debug}
                  checked={debug}
                  onChange={(e) => setDebug(e.target.checked)}
                />
              </Col>
            </Row>
            <Row>
              <Col>&nbsp;</Col>
            </Row>
            <Stack direction="horizontal" gap={3}>
              <Link to={"/hub"}>
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button variant="success" onClick={saveHub}>
                Save
              </Button>
            </Stack>
          </form>
        </Container>
      )}
    </>
  );
}

export default HubForm;
