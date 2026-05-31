import { useState, useEffect } from "react";
import "./Contact.css";

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend
  };

  return (
    <>
      <div className="contact-hero">
        <h1 className="contact-hero-title">Contact Us</h1>
        <p className="contact-hero-sub">We&apos;d love to hear from you.</p>
      </div>

      <section className="contact-section">
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2 className="contact-form-title">Send a Message</h2>

            <div className="contact-field">
              <label className="contact-label">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="contact-input"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="contact-field">
              <label className="contact-label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="contact-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="contact-field">
              <label className="contact-label">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="contact-input"
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="contact-field">
              <label className="contact-label">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="contact-input contact-textarea"
                placeholder="Write your message here..."
                rows={5}
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <h2 className="contact-form-title">Get in Touch</h2>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-brands fa-whatsapp" />
                </div>
                <div>
                  <p className="contact-info-label">WhatsApp</p>
                  <p className="contact-info-value">+1 849-999-8598</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-brands fa-instagram" />
                </div>
                <div>
                  <p className="contact-info-label">Instagram</p>
                  <p className="contact-info-value">@kicks_district_sti</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-solid fa-location-dot" />
                </div>
                <div>
                  <p className="contact-info-label">Location</p>
                  <p className="contact-info-value">Santiago, Dominican Republic</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-solid fa-clock" />
                </div>
                <div>
                  <p className="contact-info-label">Business Hours</p>
                  <p className="contact-info-value">Mon – Sat, 9am – 8pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
