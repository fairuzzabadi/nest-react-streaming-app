import { darken, lighten } from "polished";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegFileImage } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { keyframes, styled } from "styled-components";
import api from "../api";
import { useVideo } from "../hooks";
import ModalContainer from "./modal.styled";
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

  button {
    span {
      font-size: 0.75rem;
    }
  }

  form > div {
    padding: 0 1rem;
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.2, theme.colors.background)
          : lighten(0.2, theme.colors.background)};
  }

  .input-title {
    margin-top: 1rem;
    flex-direction: column;
    gap: 0.5rem;
    padding-bottom: 0.5rem;

    input {
      all: unset;
      font-size: 0.85rem;
      background: ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.2, theme.colors.background)
          : lighten(0.2, theme.colors.background)};
      padding: 0.125rem 0.5rem;
      border-radius: 3px;
    }
  }

  .input-cover {
    margin-top: 1rem;
    padding-bottom: 0.5rem;
    gap: 2rem;
    align-items: center;
    justify-content: center;

    button {
      all: unset;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      svg {
        font-size: 2rem;
      }
    }

    img {
      width: 120px;
      height: 120px;
      object-fit: contain;
      box-shadow: 0px 1px 15px #0000006c;
    }

    input {
      display: none;
    }
  }

  .buttons {
    display: flex;
    gap: 1rem;
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
`;

export default function EditVideoModal({ onClose, videoId }: ModalProps) {
  const container = document.querySelector("#modal-portal");
  if (!container) {
    return null;
  }

  const [videoCover, setVideoCover] = useState("");
  const [processing, setProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const video = useVideo(videoId);

  useEffect(() => {
    if (video) {
      setVideoCover(
        import.meta.env.VITE_API_ENDPOINT + `/video/cover/${video.coverImage}`
      );
    }
  }, [video]);

  const proceed = () => {
    setProcessing(true);

    const datas = new FormData(formRef.current!);
    api
      .patch(`/video/${videoId}`, datas)
      .then(() => {
        location.reload();
      })
      .catch((err) => console.error(err))
      .finally(() => setProcessing(false));
  };

  const coverInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files![0];
    setVideoCover(URL.createObjectURL(file));
  };

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
          <span>Edit video metadatas</span>
          <button
            onClick={() => {
              if (!processing) {
                onClose();
              }
            }}
          >
            <AiOutlineClose />
          </button>
        </h1>
        <form ref={formRef}>
          <div className="input-title">
            <label htmlFor="video-title">Video title</label>
            <input
              type="text"
              name="title"
              id="video-title"
              defaultValue={video?.title}
              maxLength={50}
            />
          </div>
          <div className="input-cover">
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget
                  .nextElementSibling as HTMLInputElement;
                input.click();
              }}
            >
              <span>Change video cover</span>
              <FaRegFileImage />
            </button>
            <input
              onChange={coverInputOnChange}
              type="file"
              accept="image/*"
              name="cover"
            />
            <img src={videoCover} alt="video-cover" />
          </div>
        </form>
        <div className="buttons">
          <button onClick={onClose} className="cancel" disabled={processing}>
            Cancel
          </button>
          <button onClick={proceed} className="yes" disabled={processing}>
            {processing ? <VscLoading /> : "Update"}
          </button>
        </div>
      </StyledModal>
    </>,
    container
  );
}
