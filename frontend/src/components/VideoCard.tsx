import { useEffect, useState } from "react";
import { styled } from "styled-components";
import api from "../api";
import { darken, lighten } from "polished";
import { FaPlay } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import DeleteVideoModal from "./DeleteVideo.modal";
import { EditVideoModal } from ".";

type CardProps = {
  id: string;
  title: string;
  coverImage: string;
  uploadDate: Date;
  userId: string;
  length?: string;
  hideUserData?: boolean;
  showControls?: boolean;
};

const StyledCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  transition: box-shadow 500ms;
  display: flex;
  flex-direction: column;

  background: ${({ theme }) =>
    theme.theme === "light"
      ? darken(0.1, theme.colors.background)
      : lighten(0.1, theme.colors.background)};

  &:hover {
    box-shadow: 0 1px 15px
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.5, theme.colors.background)
          : lighten(0.5, theme.colors.background)};

    .play {
      transform: translate(0);
      opacity: 1;
    }
  }

  #title {
    display: block;
    letter-spacing: normal;
    font-weight: bold;
    font-size: 1rem;
    min-height: 3rem;
  }

  & > div:first-of-type {
    border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
    background-color: grey;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      max-height: 280px;
      object-fit: cover;
    }
  }

  .misc {
    padding: 0.5rem 1rem 2rem;
  }

  img {
    width: 100%;
    object-fit: contain;
  }

  .duration {
    position: absolute;
    top: 1rem;
    right: 1rem;
    border-radius: 7px;
    font-size: 0.75rem;
    padding: 5px 10px;
    color: white;
    background-color: #00000060;
  }

  .play {
    all: unset;
    cursor: pointer;
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    font-size: 1.5rem;
    opacity: 0;
    transform: translateY(10px);
    transition: transform 500ms, opacity 500ms;
    color: white;
    background: ${({ theme }) => theme.colors.playButton};
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    box-shadow: 0 3px 5px #00000086;

    &:active {
      box-shadow: inset 0 0 5px #000000ba;
    }

    svg {
      transform: translateX(2px);
    }
  }

  .upload-date {
    margin-top: 1rem;
    color: ${({ theme }) =>
      theme.theme === "light"
        ? lighten(0.125, theme.colors.primary)
        : darken(0.125, theme.colors.primary)};
  }

  .user-name {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: ${({ theme }) =>
      theme.theme === "light"
        ? lighten(0.05, theme.colors.primary)
        : darken(0.05, theme.colors.primary)};

    .dot {
      display: block;
      width: 7px;
      height: 7px;
      background: ${({ theme }) => theme.colors.quaternary};
      border-radius: 100%;
    }
  }
`;

const StyledUserPicture = styled.div<{ $image?: string }>`
  position: relative;

  div {
    position: absolute;
    bottom: 0;
    right: 1rem;
    transform: translateY(50%);
    width: 52px;
    height: 52px;
    border-radius: 50rem;
    padding: 2px;
    border: 2px solid ${({ theme }) => theme.colors.quaternary};
    background-image: url(${({ $image }) => $image});
    background-size: cover;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const StyledControls = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  button {
    all: unset;
    color: ${({ theme }) => theme.colors.background};
    width: 3rem;
    height: 3rem;
    display: grid;
    font-size: 1.25rem;
    place-items: center;
    cursor: pointer;
    border-radius: 3rem;
    transition: all 250ms;

    &:hover {
      background: transparent;
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .edit {
    background: #3f3fffa8;

    &:hover {
      outline: 3px solid #3f3fffa8;
    }
  }

  .delete {
    background: #ff1d1d88;

    svg {
      transform: translateX(-1px);
    }

    &:hover {
      outline: 3px solid #ff1d1d88;
    }
  }
`;

export default function VideoCard(props: CardProps) {
  const [user, setUser] = useState<{
    name: string;
    picture: string;
  } | null>(null);

  const [showEditVideoModal, setShowEditVideoModal] = useState(false);
  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);
  const [uploadDate, setUploadDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await api.get(`/user/${props.userId}`);
      const name: string = res.data.fullname;
      setUser({
        name:
          name.length >= 20
            ? name
                .split(" ")
                .map((name, i) => (i > 0 ? `${name[0].toUpperCase()}.` : name))
                .join(" ")
            : name,
        picture: res.data.avatar
          ? `${import.meta.env.VITE_API_ENDPOINT}/user/picture/${
              res.data.avatar
            }`
          : "/images/profile-pic.png",
      });
    };

    const timestamp = +props.uploadDate;
    const elapsed = Date.now() - timestamp;

    const min = elapsed / 1000 / 60;
    if (min <= 1) {
      setUploadDate("now");
    } else {
      const hours = min / 60;
      if (hours < 1) {
        const elapsed = Math.round(hours);
        setUploadDate(
          elapsed === 0
            ? "Just now"
            : `${elapsed} minute${elapsed > 1 ? "s" : ""} ago`
        );
      } else {
        if (hours < 24) {
          const elapsed = Math.round(hours);
          setUploadDate(`${elapsed} hour${elapsed > 1 ? "s" : ""} ago`);
        } else {
          const days = Math.round(hours / 24);
          setUploadDate(`${days} day${days > 1 ? "s" : ""} ago`);
        }
      }
    }

    if (!props.hideUserData) {
      fetchUserData().catch((err) => console.error(err));
    }
  }, []);

  const playBtnOnClick = () => {
    navigate(`/video/${props.id}`);
  };

  const editBtnOnClick = () => {
    setShowEditVideoModal(true);
  };

  const deleteBtnOnClick = () => {
    setShowDeleteVideoModal(true);
  };

  return (
    <>
      {showDeleteVideoModal && (
        <DeleteVideoModal
          onClose={() => setShowDeleteVideoModal(false)}
          videoId={props.id}
        />
      )}
      {showEditVideoModal && (
        <EditVideoModal
          onClose={() => setShowEditVideoModal(false)}
          videoId={props.id}
        />
      )}
      <StyledCard>
        <div>
          {props.length && <div className="duration">{props.length}</div>}
          <img
            src={`${import.meta.env.VITE_API_ENDPOINT}/video/cover/${
              props.coverImage
            }`}
            alt=""
          />
          <button className="play" onClick={playBtnOnClick}>
            <FaPlay />
          </button>
        </div>
        {user && (
          <StyledUserPicture $image={user.picture}>
            <div></div>
          </StyledUserPicture>
        )}
        <div className="misc">
          {user && (
            <div className="user-name">
              <span>{user.name}</span>
              <span className="dot"></span>
            </div>
          )}
          <h1 id="title">{props.title}</h1>
          {uploadDate && <div className="upload-date">{uploadDate}</div>}
        </div>
        {props.showControls && (
          <StyledControls>
            <button className="edit" onClick={editBtnOnClick}>
              <MdModeEditOutline />
            </button>
            <button className="delete" onClick={deleteBtnOnClick}>
              <FaDeleteLeft />
            </button>
          </StyledControls>
        )}
      </StyledCard>
    </>
  );
}
