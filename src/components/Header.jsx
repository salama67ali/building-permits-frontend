import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from 'bootstrap/js/dist/toast';

function Header({ username }) {
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast && toastRef.current) {
      const toast = new Toast(toastRef.current);
      toast.show();
    }
  }, [showToast]);

  const handleLogout = () => {
    localStorage.clear();
    setShowToast(true);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <>
      <header className="bg-primary text-white py-3 px-4 w-100 shadow-sm">
        <div className="d-flex justify-content-between align-items-center container-fluid">
          <h4 className="mb-0">Building Permissions Management</h4>
          <div className="d-flex align-items-center gap-3">
            <h6 className="mb-0 fw-normal">Welcome, {username || 'User'}</h6>
            <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div
        ref={toastRef}
        className="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-delay="1400"
      >
        <div className="d-flex">
          <div className="toast-body">You have successfully logged out of the system.</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </>
  );
}

export default Header;