import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} <strong>Tracker and Solver App</strong>. Designed &amp; Developed with MERN Stack.
        </p>
        <div className="footer-links">
          <span>MongoDB &bull; Express.js &bull; React &bull; Node.js</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
