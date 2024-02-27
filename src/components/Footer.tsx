import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <p className="text-center">
          Made by{" "}
          <a
            href="https://github.com/cyqjoseph"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "none" }}
          >
            Joseph
          </a>
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
