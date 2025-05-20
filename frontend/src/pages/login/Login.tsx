import { keyframes, styled } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../../components";
import api from "../../api";
import { useState } from "react";
import { VscLoading } from "react-icons/vsc";
import themes from "../../styles/themes";
import { lighten } from "polished";

const spin = keyframes`
  from {
    transform: rotate(0);
  } to {
    transform: rotate(360deg);
  }
`;

const errorShowing = keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;

  @media (max-width: ${themes.screen.l}) {
    position: relative;
  }
`;

const Image = styled.div`
  background: url(/images/backgrounds/login-bg.jpg);
  background-size: cover;
  background-position: center;
  flex-grow: 1;
  min-width: 65%;

  @media (max-width: ${themes.screen.l}) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;

  @media (max-width: ${themes.screen.s}) {
    color: white;

    input {
      color: #ffffff76 !important;
    }
  }

  @media (max-width: ${themes.screen.l}) {
    background: #00000075;
  }

  h1 {
    text-transform: uppercase;
    margin: 0 0.25rem;
  }

  p {
    border-radius: 3px;
    overflow-x: hidden;
  }

  form {
    min-width: 280px;
  }

  input {
    width: 100%;
    border: none;
    background: ${({ theme }) => theme.colors.secondary};
    padding: 0.5rem 1rem;
    color: ${({ theme }) => theme.colors.primary};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.placeholder};
    }
  }

  button {
    background: ${({ theme }) => theme.colors.quaternary};
    border: none;
    color: ${({ theme }) => theme.colors.opposite};
    border-radius: 25px;
    padding: 0.75rem 4rem;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 1rem;
    transition: transform 350ms, box-shadow 350ms;

    &:not([disabled]):hover {
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.35);
      transform: translateY(-5px);
    }

    &[type="submit"] {
      display: flex;
      gap: 1rem;
      align-items: center;

      svg {
        font-size: 1.25rem;
        animation: ${spin} 1s ease-out infinite;
      }
    }

    &[disabled] {
      background: grey;
    }
  }

  .submit-btn {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }

  .greetings {
    font-size: 1.25rem;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  .buttons {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    font-size: 0.75rem;

    * {
      color: ${({ theme }) => lighten(0.3, theme.colors.secondary)};
    }
  }

  .error {
    color: red;
    text-align: center;
    margin-top: 1rem;
    animation: ${errorShowing} 250ms both;
  }
`;

function Login() {
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    setChecking(true);
    api
      .post("/auth/signin", {
        email: formData.get("email"),
        password: formData.get("password"),
      })
      .then((res) => {
        const { id, token, refreshToken } = res.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("token", token);
        localStorage.setItem("refresh", refreshToken);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        const message = err.response.data.message;
        setError(message);
      })
      .finally(() => {
        setChecking(false);
      });
  };

  return (
    <Container>
      <Image />
      <Card>
        <h1>user login</h1>
        <p className="greetings">
          <span>Welcome to </span>
          <Logo />
        </p>
        <form onSubmit={formOnSubmit}>
          <p>
            <input type="email" name="email" placeholder="Your email" />
          </p>
          <p>
            <input
              type="password"
              name="password"
              placeholder="Your password"
            />
          </p>
          <div className="buttons">
            <Link to="/signup">Not registered ?</Link>
            <Link to="/forgot-password">Forgot password ?</Link>
          </div>
          {error.length > 0 && <p className="error">{error}</p>}
          <div className="submit-btn">
            <button type="submit" disabled={checking}>
              <span>login</span>
              {checking && <VscLoading />}
            </button>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default Login;
