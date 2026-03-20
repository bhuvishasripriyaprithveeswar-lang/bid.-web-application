import { useState } from 'react';

const Footer = () => {
  const [modal, setModal] = useState(null);

  const content = {
    terms: {
      title: 'Terms & Conditions',
      body: `By using bid., you agree to participate in auctions honestly and in good faith. All bids are binding. bid. reserves the right to remove listings or users that violate platform rules. Payments must be completed within 24 hours of winning an auction. bid. is not responsible for disputes between buyers and sellers beyond the platform's scope.`,
    },
    privacy: {
      title: 'Privacy Policy',
      body: `bid. collects only the information necessary to operate the platform — including your name, email, and bidding activity. We do not sell your data to third parties. Payment card details are never stored in full. You may request deletion of your account and associated data at any time by contacting us.`,
    },
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand"><span style={{ color: 'var(--danger)' }}>b</span>id.</span>
          <div className="footer-links">
            <button className="footer-link" onClick={() => setModal('terms')}>Terms &amp; Conditions</button>
            <button className="footer-link" onClick={() => setModal('privacy')}>Privacy Policy</button>
            <a className="footer-link" href="mailto:bhuvishasripriyaprithveeswar@gmail.com">Contact Us</a>
          </div>
          <span className="footer-copy">© {new Date().getFullYear()} bid. All rights reserved.</span>
        </div>
      </footer>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{content[modal].title}</h3>
            <p className="modal-body">{content[modal].body}</p>
            <button className="btn btn-primary" onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
