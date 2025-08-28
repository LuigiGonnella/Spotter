import { Dumbbell } from "lucide-react";
import { SiInstagram, SiX, SiFacebook, SiYoutube } from "react-icons/si";
import { Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer style={{ background: '#111', color: '#fff', padding: '4rem 0' }} data-testid="footer">
      <Row style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <Row>
          <Col lg={3} md={6} sm={12} style={{}}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Dumbbell style={{ color: '#FFD700', fontSize: '2rem', marginRight: '0.5rem' }} />
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#FFD700' }} data-testid="footer-brand">Spotter</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#fff', opacity: 0.8, fontSize: '1.5rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FFD700'} onMouseOut={e => e.currentTarget.style.color = '#fff'} data-testid="social-instagram">
                <SiInstagram />
              </a>
              <a href="#" style={{ color: '#fff', opacity: 0.8, fontSize: '1.5rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FFD700'} onMouseOut={e => e.currentTarget.style.color = '#fff'} data-testid="social-twitter">
                <SiX />
              </a>
              <a href="#" style={{ color: '#fff', opacity: 0.8, fontSize: '1.5rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FFD700'} onMouseOut={e => e.currentTarget.style.color = '#fff'} data-testid="social-facebook">
                <SiFacebook />
              </a>
              <a href="#" style={{ color: '#fff', opacity: 0.8, fontSize: '1.5rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FFD700'} onMouseOut={e => e.currentTarget.style.color = '#fff'} data-testid="social-youtube">
                <SiYoutube />
              </a>
            </div>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }} data-testid="footer-product-title">Product</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-features">Features</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-pricing">Pricing</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-mobile">Mobile App</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-api">API</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }} data-testid="footer-company-title">Company</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-about">About</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-careers">Careers</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-press">Press</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-blog">Blog</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }} data-testid="footer-support-title">Support</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-help">Help Center</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-contact">Contact Us</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-community">Community</a></li>
              <li><a href="#" style={footerLinkStyle} data-testid="footer-safety">Safety</a></li>
            </ul>
          </Col>
        </Row>
        <div style={{ borderTop: '2px solid #333', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }} className="md:flex-row">
          <p style={{ color: '#fff', opacity: 0.7, fontSize: '0.95rem', paddingTop:20 }} data-testid="footer-copyright">
            © 2025 Spotter. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={footerLinkStyle} data-testid="footer-privacy">Privacy Policy</a>
            <a href="#" style={footerLinkStyle} data-testid="footer-terms">Terms of Service</a>
            <a href="#" style={footerLinkStyle} data-testid="footer-cookies">Cookie Policy</a>
          </div>
        </div>
      </Row>
      <style>{`
        footer a:hover { color: #FFD700 !important; }
      `}</style>
    </footer>
  );

}

const footerLinkStyle = {
  color: '#fff',
  opacity: 0.8,
  textDecoration: 'none',
  fontSize: '1rem',
  transition: 'color 0.2s',
};
  

