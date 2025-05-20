import { useCallback, useState } from "react";
import { useVideo } from "../hooks";
import { createPortal } from "react-dom";
import { keyframes, styled } from "styled-components";
import { darken, lighten } from "polished";
import ModalContainer from "./modal.styled";
import { VscLoading } from "react-icons/vsc";
import { AiOutlineClose } from "react-icons/ai";
import { PiWarningDiamondFill } from "react-icons/pi";
import api from "../api";
import themes from "../styles/themes";

type ModalProps = {
  videoId: string;
  onClose: () => void;
};

const spin = keyframes`
from {
  transform: rotate(0);
} to {
  transform: rotate(360deg);
}
`;

const StyledBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  backdrop-filter: blur(1px);
  z-index: 1;
`;

const StyledModal = styled(ModalContainer)`
  @media (min-width: ${themes.screen.m}) {
    width: 380px;
  }

  & > div {
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.2, theme.colors.background)
          : lighten(0.2, theme.colors.background)};

    & > div:first-of-type {
      color: ${({ theme }) => theme.colors.quaternary};
      font-size: 3.5rem;
    }
  }

  p {
    margin: unset;
    padding: 0.5em;
  }

  .buttons {
    padding: 1rem;
    justify-content: flex-end;

    button {
      all: unset;
      cursor: pointer;
      width: 6rem;
      text-align: center;
      padding: 2px 0;
      border-radius: 3px;
      outline: 2px solid ${({ theme }) => theme.colors.quaternary};
      transition: color 250ms, backkground-color 250ms;
    }

    svg {
      animation: ${spin} 750ms ease-out infinite;
    }

    .cancel {
      &:hover {
        background-color: ${({ theme }) => theme.colors.quaternary};
        color: white;
      }

      &[disabled] {
        background: grey;
        outline: none;

        &:hover {
          background: grey;
          color: unset;
        }
      }
    }

    .yes {
      background-color: ${({ theme }) => theme.colors.quaternary};
      color: white;

      &[disabled] {
        background-color: ${({ theme }) => theme.colors.quaternary};

        &:hover {
          background-color: ${({ theme }) => theme.colors.quaternary};
        }
      }

      &:hover {
        background-color: transparent;
        color: unset;
      }
    }
  }

  .video-title {
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;

    &::after {
      display: block;
      width: 100%;
      height: 0.25rem;
      content: "";
      background: ${({ theme }) =>
        theme.theme === "light"
          ? theme.colors.background
          : lighten(0.1, theme.colors.background)};
      position: absolute;
      bottom: 0;
    }
  }
`;

export default function DeleteVideoModal({ onClose: cb, videoId }: ModalProps) {
  const container = document.querySelector("#modal-portal");
  if (!container) {
    return null;
  }

  const videoTitle = useVideo(videoId)?.title;
  const [processing, setProcessing] = useState(false);

  const proceed = () => {
    setProcessing(true);
    api
      .delete(`video/${videoId}`)
      .catch((err) => console.error(err))
      .finally(() => {
        cb();
        location.reload();
      });
  };

  const onClose = useCallback(() => {
    if (!processing) {
      cb();
    }
  }, [processing]);

  return createPortal(
    <>
      <StyledBackground
        onClick={() => {
          if (!processing) {
            onClose();
          }
        }}
      />
      <StyledModal>
        <h1>
          <span>Are you sure ?</span>
          <button onClick={onClose}>
            <AiOutlineClose />
          </button>
        </h1>
        <div>
          <div>
            <PiWarningDiamondFill />
          </div>
          <div>
            <p>You are about to delete :</p>
            <p className="video-title">{videoTitle}</p>
          </div>
        </div>
        <div className="buttons">
          <button onClick={onClose} className="cancel" disabled={processing}>
            Cancel
          </button>
          <button onClick={proceed} className="yes" disabled={processing}>
            {processing ? <VscLoading /> : "Yes"}
          </button>
        </div>
      </StyledModal>
    </>,
    container
  );
}
