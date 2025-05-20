import { BsArrowLeft, BsFingerprint } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Pagination from "./Pagination";
import Icon from "./Icon";
import { Input } from "../../../components";
import Button from "./Button";
import Title from "./Title";
import api from "../../../api";

const rotate = keyframes`
  from {
    transform: rotate(360deg);
  } to {
    transform: rotate(0deg);
  }
`;

const Form = styled.form`
  .buttons {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    a {
      color: ${({ theme }) => theme.colors.secondary};
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      svg {
        display: none;
        animation: ${rotate} 750ms both linear infinite;
      }
    }

    button[disabled] {
      svg {
        display: block;
      }
    }
  }

  .error {
    color: red;
  }
`;

function EnterEmail() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const email: string = e.currentTarget.email.value;

    const btn = document.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;
    btn.disabled = true;

    api
      .post("/auth/reset-password", {
        email,
      })
      .then(() => {
        navigate("/forgot-password/2", {
          state: {
            email,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        btn.disabled = false;
        setError(err.response.data.message);
      });
  };

  return (
    <>
      <Icon>
        <BsFingerprint />
      </Icon>
      <Title>Forgot password?</Title>
      <p>Don't panic, we'll send you reset instructions.</p>
      <Form onSubmit={formOnSubmit}>
        <Input
          name="email"
          id="email"
          type="email"
          label="Enter your email"
          onChange={() => {
            setError("");
          }}
        />
        <div className="buttons">
          <Button type="submit">
            <span>Reset password</span>
            <AiOutlineLoading />
          </Button>
          <Link to="/">
            <BsArrowLeft />
            <span>Back to log in</span>
          </Link>
        </div>
        {error && <p className="error">{error}</p>}
      </Form>
      <Pagination active={1} />
    </>
  );
}

export default EnterEmail;
