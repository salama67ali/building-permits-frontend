import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Offcanvas, Button } from 'react-bootstrap';

function Sidebar({ role }) {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  const renderLinks = () => {
    switch (role) {
      case 'owner':
        return (
          <>
            <Nav.Link as={Link} to="/owner/apply-permit">Apply for Permit</Nav.Link>
            <Nav.Link as={Link} to="/owner/view-applications">View My Applications</Nav.Link>
            <Nav.Link href="/help/user-guide.html" target="_blank" rel="noopener noreferrer">Help & Support</Nav.Link>
          </>
        );
      case 'government-boards':
        return (
          <>
            <Nav.Link as={Link} to="/government-boards/review-applications">Review Applications</Nav.Link>
            <Nav.Link href="/help/user-guide.html" target="_blank" rel="noopener noreferrer">Help & Support</Nav.Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Nav.Link as={Link} to="/admin/manage-users">Manage Users</Nav.Link>
            <Nav.Link as={Link} to="/admin/view-reports">View Reports</Nav.Link>
            <Nav.Link href="/help/user-guide.html" target="_blank" rel="noopener noreferrer">Help & Support</Nav.Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className="m-2"
        onClick={handleToggle}
      >
        ☰ Menu
      </Button>

      <Offcanvas show={show} onHide={handleToggle}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {renderLinks()}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
