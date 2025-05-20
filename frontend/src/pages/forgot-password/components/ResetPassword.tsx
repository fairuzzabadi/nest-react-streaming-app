import { HiOutlineMailOpen } from "react-icons/hi";
import { BsArrowLeft } from "react-icons/bs";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useRef } from "react";
import React from "react";
import Icon from "./Icon";
import Button from "./Button";
import Title from "./Title";
import Pagination from "./Pagination";
import { styled } from "styled-components";
import api from "../../../api";

const Text = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  span {
    font-weight: bold;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  input {
    max-width: 3.5rem;
    padding: 0.5rem 0;
    font-size: 2rem;
    text-align: center;
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: none;
    outline: none;

    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  p {
    text-align: center;
    margin: unset;
    color: ${({ theme }) => theme.colors.secondary};
  }

  input {
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.secondaryVariant};
  }

  .input {
    display: flex;
    justify-content: space-between;
  }

  p.back {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    transform: translateX(-1rem);

    & > * {
      color: ${({ theme }) => theme.colors.secondary};
      transition: color 500ms;
    }

    &:hover > * {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .error {
    text-align: start;
    color: red;
  }

  input.filled {
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.primary};
  }

  button.resend {
    border: unset;
    background: transparent;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function ResetPassword() {
  const location = useLocation();
  const [email, _] = useState<string>(location.state?.email);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const datas = new FormData(e.currentTarget);
    let code = "";
    for (let i = 0; i < 4; ++i) {
      code += datas.get(`${i}`)?.toString();
    }

    api
      .post("/auth/validate-code", { code })
      .then(() => {
        navigate("/forgot-password/3", {
          state: {
            email,
            code,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setError(err.response.data.message);
      });
  };

  const resendBtnOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    api
      .post("/auth/reset-password", {
        email,
      })
      .then(() => {
        setError("Check your mailbox.");
      });
  };

  const inputOnInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const input = e.currentTarget;
    const value = parseInt(input.value);
    if (Number.isNaN(value)) {
      input.value = "";
    } else {
      input.classList.toggle("filled");

      const nextInput = input.nextElementSibling;
      if (nextInput) {
        const input = nextInput as HTMLInputElement;
        input.focus();
      }
    }

    if (input.value === "") {
      input.classList.remove("filled");
    }
  };

  const inputOnPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const clipboard = e.clipboardData.getData("text");
    const value = parseInt(clipboard);
    if (Number.isInteger(value) && clipboard.length === 4) {
      const container = inputContainerRef.current;
      if (container) {
        const inputList = container.querySelectorAll("input");
        for (let i = 0; i < 4; ++i) {
          const input = inputList[i];
          input.value = clipboard[i];
          input.classList.add("filled");
        }
      }
    }
  };

  return (
    <>
      <Icon>
        <HiOutlineMailOpen />
      </Icon>
      <Title>Password reset</Title>
      <Text>
        We sent a code to <span style={{ fontWeight: "bold" }}>{email}</span>
      </Text>
      <Form onSubmit={formOnSubmit}>
        <div className="input" ref={inputContainerRef}>
          <input
            required
            autoComplete="off"
            type="text"
            maxLength={1}
            name="0"
            id="0"
            onInput={inputOnInput}
            onPaste={inputOnPaste}
            onFocus={() => setError("")}
          />
          <input
            required
            autoComplete="off"
            type="text"
            maxLength={1}
            name="1"
            id="1"
            onInput={inputOnInput}
            onPaste={inputOnPaste}
            onFocus={() => setError("")}
          />
          <input
            required
            autoComplete="off"
            type="text"
            maxLength={1}
            name="2"
            id="2"
            onInput={inputOnInput}
            onPaste={inputOnPaste}
            onFocus={() => setError("")}
          />
          <input
            required
            autoComplete="off"
            type="text"
            maxLength={1}
            name="3"
            id="3"
            onInput={inputOnInput}
            onPaste={inputOnPaste}
            onFocus={() => setError("")}
          />
        </div>
        <Button type="submit">Continue</Button>
        {error && <p className="error">{error}</p>}
        <p>
          Didn't receive the mail?{" "}
          <button onClick={resendBtnOnClick} className="resend">
            Click to resend
          </button>
        </p>
        <p className="back">
          <BsArrowLeft />
          <Link to="/">
            <span>Back to log in</span>
          </Link>
        </p>
      </Form>
      <Pagination active={2} />
    </>
  );
}

export default ResetPassword;
