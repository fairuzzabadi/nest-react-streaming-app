import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { MdOutlinePassword } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { keyframes, styled } from "styled-components";
import api from "../../../api";
import { Input } from "../../../components";
import Button from "./Button";
import Icon from "./Icon";
import Pagination from "./Pagination";
import Title from "./Title";

const spin = keyframes`
from {
  transform: rotate(0deg);
} to {
  transform: rotate(360deg);
}
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  svg {
    animation: ${spin} 500ms infinite;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  button {
    margin: 0.5rem 0;
  }

  .error {
    color: red;
    position: relative;
    margin-bottom: 0.5rem;

    p {
      margin: unset;
      position: absolute;
      top: 0;
      font-size: 0.75rem;
    }
  }

  .back {
    margin: unset;
    color: ${({ theme }) => theme.colors.secondary};

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;

    & > * {
      color: ${({ theme }) => theme.colors.secondary};
      transition: color 500ms;
    }

    &:hover > * {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

function SetNewPassword() {
  const location = useLocation();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const code: string | undefined = location.state?.code;

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    setProcessing(true);
    api
      .post("/user/password", {
        code,
        password: data.get("password"),
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log({
          status: err.response.status,
        });
        if (err.response.status === 400 || err.response.status === 403) {
          setError("Can not set password, invalid code provided.");
        } else {
          setError("Unable to set password, an error occured.");
        }
      })
      .finally(() => setProcessing(false));
  };

  return (
    <>
      <Icon>
        <MdOutlinePassword />
      </Icon>
      <Title>Set new password</Title>
      <Form onSubmit={formOnSubmit}>
        <div className="error">{error.length > 0 && <p>{error}</p>}</div>
        <Input
          label="Password"
          name="password"
          id="password"
          type="password"
          onChange={() => {
            setError("");
          }}
        />
        <Input
          label="Confirm password"
          name="confirm-password"
          id="confirm_password"
          type="password"
          onChange={(value) => {
            const input = document.querySelector(
              "#password"
            ) as HTMLInputElement;

            if (value) {
              if (value !== input.value) {
                setError("Passwords don't match.");
              } else {
                setError("");
              }
            }
          }}
        />
        <StyledButton type="submit" disabled={processing}>
          <span>Reset password</span>
          {processing && <AiOutlineLoading />}
        </StyledButton>
        <p className="back">
          <BsArrowLeft />
          <Link to="/">
            <span>Back to log in</span>
          </Link>
        </p>
      </Form>
      <Pagination active={3} />
    </>
  );
}

export default SetNewPassword;
