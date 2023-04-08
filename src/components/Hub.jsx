import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Hub(props) {
  const url = "/api/hub";

  const [hub, setHub] = useState(null); //load empty hub
  const [status, setStatus] = useState("");

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

  function restartHub() {
    const requestOptions = {
      method: "POST",
    };
    fetch("/api/restart", requestOptions)
      .then((response) => {
        if (!response.ok) {
          toast.error(response.error);
          return {};
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
      });
  }

  const downloadConfig = () => {
    fetch("/api/config")
      .then((response) => {
        if (!response.ok) {
          console.error(response.error);
          return {};
        }
        return response.json();
      })
      .then((data) => {
        // create file in browser
        const fileName = "lantern-config";
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
  };

  function getCurrentmonitorStatus() {
    fetch("/api/status")
      .then((response) => {
        if (!response.ok) {
          toast.error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        setStatus(data.message);
      });
  }

  return (
    <>
      {hub && (
        <Container style={{ textAlign: "left" }} className="d-grid gap-1">
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <h1>Hub</h1>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>Voltage calibration factor</Col>
            <Col>{hub.voltage_calibration_factor}</Col>
          </Row>
          {/* <Row>
            <Col>Port calibration factor</Col>
            <Col>{hub.port_calibration_factor}</Col>
          </Row> */}
          <Row>
            <Col>Phases</Col>
            <Col>{hub.phases.length}</Col>
          </Row>
          <Row>
            <Col>Frequency</Col>
            <Col>{hub.frequency}</Col>
          </Row>
          <Row>
            <Col>MQTT broker URL</Col>
            <Col>{hub.mqtt_broker_url}</Col>
          </Row>
          <Row>
            <Col>MQTT username</Col>
            <Col>{hub.mqtt_user_name}</Col>
          </Row>
          <Row>
            <Col>Need calibration</Col>
            <Col>{hub.needs_calibration ? "ja" : "nee"}</Col>
          </Row>
          <Row>
            <Col>Debug mode</Col>
            <Col>{hub.debug ? "ja" : "nee"}</Col>
          </Row>
          <Row>
            <Col>&nbsp;</Col>
          </Row>
          <Row>
            <Col>
              <Link to={"/hubform"}>
                <Button>Edit</Button>
              </Link>
            </Col>
            <Col>
              <Button
                variant="danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Weet je zeker dat je de Lantern Hub wilt herstarten?"
                    )
                  )
                    restartHub();
                }}
              >
                <ArrowClockwise /> Herstart Hub
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={downloadConfig}>Download config</Button>
            </Col>
            <Col>
              <Button onClick={getCurrentmonitorStatus}>
                Toon status currentmonitor
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <p
                dangerouslySetInnerHTML={{
                  __html: status.replace(/\n/g, "<br />"),
                }}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Hub;
