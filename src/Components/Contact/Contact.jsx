import { useState } from "react";
import emailjs from "emailjs-com";
import "./Contact.scss";

export default function Contact() {
  const [message, setMessage] = useState();

  function handleSubmit(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_j1z03a9",
        "template_ykriudc",
        e.target,
        "user_QJ6PO7V84VllhzxUD6yaB"
      )
      .then(
        (result) => {
          console.log(result.text);
          setMessage(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
  return (
    <div className="contact" id="contact">
      <div className="left">
        <img src="assets/shake.svg" alt="" />
      </div>
      <div className="right">
        <h2>Contact.</h2>
        {message ? (
          <div><h3>Thank you for your interest!!!</h3>
        <p>I will reply your message as soon as possible</p> </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" name="user_email" />
            <textarea placeholder="Message" name="message"></textarea>
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}
