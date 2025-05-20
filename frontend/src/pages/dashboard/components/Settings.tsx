import styled, { keyframes } from "styled-components";
import { BiPencil } from "react-icons/bi";
import {
  AiOutlineEye,
  AiOutlineLoading,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { darken, lighten, transparentize } from "polished";
import { useUserData } from "../../../hooks";
import { useState } from "react";
import api from "../../../api";

const spin = keyframes`
from {
  transform: rotate(0);
} to {
  transform: rotate(360deg);
}
`;

const StyledContainer = styled.div`
  h1 {
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.theme === "dark"
          ? lighten(0.15, theme.colors.background)
          : darken(0.15, theme.colors.background)};
  }

  h2 {
    font-weight: normal;
  }

  form {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 1rem;
    flex-wrap: wrap;

    & > div:first-of-type {
      padding-right: 1rem;
    }

    & > div:last-of-type {
      width: 100%;
      max-width: 520px;

      & > div {
        padding-right: 1rem;
        margin-bottom: 1rem;
      }
    }
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  small {
    color: ${({ theme }) => transparentize(0.25, theme.colors.primary)};
  }

  button[type="submit"] {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 10px 15px;
    color: white;
    font-weight: bold;
    background: ${({ theme }) => theme.colors.quaternary};
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 5px;
    transition: background 300ms;

    &:hover {
      background: ${({ theme }) => lighten(0.05, theme.colors.quaternary)};
    }

    svg {
      animation: ${spin} 1s ease-in-out infinite;
    }
  }

  input {
    box-sizing: border-box;
    color: ${({ theme }) => theme.colors.primary};
    padding: 5px 7px;
    border-radius: 5px;
    width: 100%;
    max-width: 360px;
    border: 1.5px solid
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.5, theme.colors.background)
          : lighten(0.5, theme.colors.background)};
    background: ${({ theme }) =>
      theme.theme === "light"
        ? "transparent"
        : darken(0.25, theme.colors.background)};
  }

  .error {
    color: #d70000;
  }

  .edit {
    all: unset;
    background: ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.125, theme.colors.background)
        : lighten(0.125, theme.colors.background)};
    position: absolute;
    top: 1rem;
    right: -1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 2px 5px;
    border-radius: 5px;
    outline: 3px solid ${({ theme }) => theme.colors.background};
    cursor: pointer;
  }

  .security {
    & > div {
      margin-bottom: 1rem;
    }

    span {
      position: relative;
    }
  }

  .eye {
    all: unset;
    position: absolute;
    right: 10px;
    top: 1rem;
    cursor: pointer;
    transform: translateY(-50%);
  }

  #profil-pic {
    display: none;
  }
`;

const StyledPictureSelector = styled.div<{ $image: string }>`
  width: 186px;
  height: 186px;
  border-radius: 100%;
  position: relative;
  border: 1.5px solid
    ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.5, theme.colors.background)
        : lighten(0.5, theme.colors.background)};
  background-color: grey;
  background-image: url(${(props) => props.$image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

export default function Settings() {
  const user = useUserData();
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datas = new FormData(e.currentTarget);
    const password = datas.get("password")?.toString();
    const confirmPassword = datas.get("confirm-password")?.toString();

    if (password) {
      if (!confirmPassword) {
        setError("Confirm your new password!");
        return;
      }

      if (confirmPassword !== password) {
        setError("Passwords don't match.");
        return;
      }
    }

    datas.delete("confirm-password");

    setUploading(true);
    const userId = localStorage.getItem("userId");
    api
      .patch(`/user/${userId}`, datas)
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <StyledContainer>
      <h1>Account settings</h1>
      <form onSubmit={formOnSubmit}>
        <div>
          <label>Profile picture</label>
          <StyledPictureSelector
            $image={
              image
                ? image
                : user?.avatar
                ? `${import.meta.env.VITE_API_ENDPOINT}/user/picture/${
                    user.avatar
                  }`
                : "/images/profile-pic.png"
            }
          >
            <label htmlFor="profil-pic" className="edit">
              <BiPencil />
              <span>Edit</span>
            </label>
            <input
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  setImage(URL.createObjectURL(files[0]));
                }
              }}
              type="file"
              accept="image/*"
              id="profil-pic"
              name="avatar"
            />
          </StyledPictureSelector>
        </div>
        <div>
          <div>
            <label htmlFor="full-name">Full name</label>
            <input
              required
              type="text"
              id="full-name"
              name="fullname"
              defaultValue={user?.fullname}
            />
            <div>
              <small>You can use alphabetic characters only.</small>
            </div>
          </div>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              required
              type="email"
              name="email"
              id="email"
              defaultValue={user?.email}
            />
          </div>
          <div className="security">
            <h2>Security</h2>
            <div>
              <div>
                <small>Enter new password</small>
              </div>
              <span>
                <input type="password" name="password" id="password" />
                <button
                  type="button"
                  className="eye"
                  onClick={() => {
                    setShowPassword((show) => {
                      const input = document.querySelector(
                        "#password"
                      ) as HTMLInputElement;
                      input.type = show ? "password" : "text";
                      return !show;
                    });
                  }}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </span>
            </div>
            <div>
              <div>
                <small>Confirm password</small>
              </div>
              <span>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => {
                    setShowConfirmPassword((show) => {
                      const input = document.querySelector(
                        "#confirm-password"
                      ) as HTMLInputElement;
                      input.type = show ? "password" : "text";
                      return !show;
                    });
                  }}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </button>
              </span>
            </div>
          </div>
          <div>
            {error && <p className="error">{error}</p>}
            <button type="submit">
              <span>Update datas</span>
              {uploading && <AiOutlineLoading />}
            </button>
          </div>
        </div>
      </form>
    </StyledContainer>
  );
}
