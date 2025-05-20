import { keyframes, styled } from "styled-components";
import { Logo, Input } from "../../components";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { darken, lighten } from "polished";
import themes from "../../styles/themes";

const errorShowing = keyframes`
  from {
    transform: translateY(5px);
    opacity: 0;
  } to {
    transform: translate(0);
    opacity: 1;
  }
`;

const StyledBackground = styled.div`
  display: none;
  height: 120px;
  background: url("/images/backgrounds/animated-bg.gif");
  background-size: cover;
  position: sticky;
  top: 0;

  @media (max-width: ${themes.screen.s}) {
    display: block;
  }
`;

const Container = styled.div`
  @media (min-width: ${themes.screen.l}) {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 60% 40%;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 0;
  display: grid;
  place-items: center;

  @media (max-width: ${themes.screen.m}) {
    display: block;
    padding: 0 1.5rem 1rem;
  }

  p {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 2rem;
  }

  input {
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryVariant};
    color: ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.25, theme.colors.primary)
        : lighten(0.25, theme.colors.primary)};
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }

  .inner {
    @media (min-width: ${themes.screen.m}) {
      min-width: 480px;
    }

    margin: 0 auto;
  }

  .names {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;

    @media (max-width: ${themes.screen.s}) {
      grid-template-columns: 1fr;
    }
  }

  .confirm-pwd,
  .email-input {
    position: relative;
  }

  .error {
    color: red;
    animation: ${errorShowing} 500ms both;
    margin: unset;
    font-size: 0.95rem;
    font-weight: bold;
    position: absolute;
    top: -0.75rem;
    right: 0;
  }

  .submit-btn {
    padding-top: 0.75rem;
    display: flex;
    flex-direction: row !important;
    justify-content: center;

    button {
      box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.35);
      font-size: 1rem;
      cursor: pointer;
      border: none;
      background: ${({ theme }) => theme.colors.quaternary};
      padding: 0.75rem 3rem;
      border-radius: 25px;
      color: ${({ theme }) => theme.colors.opposite};
      transition: transform 250ms;

      &:hover {
        transform: translateY(-3px);
      }
    }
  }
`;

const Image = styled.div`
  background: url(/images/backgrounds/signup-bg.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

function Signup() {
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [emailInUse, setEmailInUse] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!passwordMismatch) {
      const formData = new FormData(e.currentTarget);

      const signup = async () => {
        await api.post("/auth/signup", {
          fullname:
            formData.get("first-name") + " " + formData.get("last-name"),
          email: formData.get("email"),
          password: formData.get("password"),
        });

        const res = await api.post("/auth/signin", {
          email: formData.get("email"),
          password: formData.get("password"),
        });

        const { id, token, refreshToken } = res.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("token", token);
        localStorage.setItem("refresh", refreshToken);
        navigate("/");
      };

      signup().catch((err) => {
        if (err.response.status === 409) {
          setEmailInUse(true);
        }

        console.error(err);
      });
    }
  };

  const passwordInputOnChange = () => {
    const password = passwordRef.current;
    const confirmPassword = confirmPasswordRef.current;
    if (password && confirmPassword) {
      const value = confirmPassword.value;
      if (value) {
        setPasswordMismatch(password.value !== value);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  return (
    <Container>
      <StyledBackground />
      <Card>
        <div className="inner">
          <h1>
            <Logo />
          </h1>
          <p>Create your account</p>
          <form onSubmit={formOnSubmit}>
            <div className="names">
              <Input label="First Name" name="first-name" id="first_name" />
              <Input label="Last Name" name="last-name" id="last_name" />
            </div>
            <div className="email-input">
              {emailInUse && <p className="error">Email already in use</p>}
              <Input
                label="Email"
                name="email"
                id="email"
                type="email"
                onChange={() => setEmailInUse(false)}
              />
            </div>
            <Input
              label="Password"
              name="password"
              id="password"
              type="password"
              inputRef={passwordRef}
            />
            <div className="confirm-pwd">
              {passwordMismatch && (
                <p className="error">Passwords don't match</p>
              )}
              <Input
                label="Confirm password"
                name=""
                id="confirm_passowrd"
                type="password"
                onChange={passwordInputOnChange}
                inputRef={confirmPasswordRef}
              />
            </div>
            <div className="submit-btn">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </Card>
      <Image />
    </Container>
  );
}

export default Signup;
