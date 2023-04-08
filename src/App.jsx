import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import BreakerForm from "./components/BreakerForm";
import Breakers from "./components/Breakers";
import Hub from "./components/Hub";
import HubForm from "./components/HubForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Lantern Configuration</Navbar.Brand>
          <Nav className="me-auto">
            <Stack direction="horizontal" gap={3}>
              <Link className="text-decoration-none" to={`hub`}>
                <Button>Hub</Button>
              </Link>
              <Link className="text-decoration-none" to={`breakers`}>
                <Button>Groepen</Button>
              </Link>
            </Stack>
          </Nav>
        </Container>
      </Navbar>
      <div id="detail">
        <div className="App">
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="hub" element={<Hub />} />
            <Route path="hubform" element={<HubForm />} />
            <Route path="breakers" element={<Breakers />} />
            <Route path="breakerform/:id" element={<BreakerForm />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </Router>
  );
}

export default App;
