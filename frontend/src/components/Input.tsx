import styled from "styled-components";
import React, { useRef } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;

  input {
    color: ${({ theme }) => theme.colors.secondary};
    background: transparent;
    outline: none;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
    padding: 0 0 0.5rem;
  }

  label {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 0.85rem;
    transform: translateY(1rem);
    transition: transform 250ms;
    cursor: text;
    user-select: none;
  }

  label.outside {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-0.5rem);
  }
`;

type InputProps = {
  name: string;
  label: string;
  type?: string;
  id?: string;
  onChange?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

function Input({ name, inputRef, type, label, onChange, id }: InputProps) {
  const labelRef = useRef<HTMLLabelElement>(null);

  const inputOnFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const label = labelRef.current;
    if (label) {
      const input = e.currentTarget;
      if (input.value === "") {
        label.classList.add("outside");
      }
    }
  };

  const inputOnBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const label = labelRef.current;
    if (label) {
      const input = e.currentTarget;
      if (input.value === "") {
        label.classList.remove("outside");
      }
    }
  };

  return (
    <Container>
      <input
        ref={inputRef}
        type={type || "text"}
        name={name}
        id={id}
        required
        onFocus={inputOnFocus}
        onBlur={inputOnBlur}
        onChange={(e) => {
          if (onChange) {
            onChange(e.currentTarget.value);
          }
        }}
      />
      <label htmlFor={id} ref={labelRef}>
        {label}
      </label>
    </Container>
  );
}

export default Input;
