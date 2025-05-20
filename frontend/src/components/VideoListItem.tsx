import { transparentize, darken, lighten } from "polished";
import { styled } from "styled-components";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import themes from "../styles/themes";

type VideoProps = {
  id: string;
  title: string;
  uploader: string;
  cover: string;
  uploadDate: string;
};

const StyledItem = styled.div<{ $cover: string }>`
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  gap: 1rem;

  & > div {
    flex: 1;
  }

  & > div:first-of-type {
    flex-grow: 1;
    background-color: grey;
    background-image: ${({ $cover }) => `url(${$cover})`};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: ${({ theme }) => theme.sizes.video.cover.width};
    height: ${({ theme }) => theme.sizes.video.cover.height};
    border-radius: 10px;

    box-shadow: 0 3px 7px
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.25, theme.colors.background)
          : lighten(0.25, theme.colors.background)};
  }

  .datas {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;

      @media (max-width: ${themes.screen.s}) {
        font-size: 0.9rem;
      }
    }

    .uploader {
      font-size: 0.95rem;
      color: ${({ theme }) => transparentize(0.25, theme.colors.primary)};
    }

    .date {
      font-size: 0.75rem;
      color: ${({ theme }) => transparentize(0.25, theme.colors.primary)};
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;

export default function VideoListItem(props: VideoProps) {
  const navigate = useNavigate();

  return (
    <StyledItem
      $cover={props.cover}
      onClick={() => {
        navigate(`/video/${props.id}`);
      }}
    >
      <div></div>
      <div className="datas">
        <div>
          <div className="title">{props.title}</div>
          <div className="uploader">
            {props.uploader.length < 48
              ? props.uploader
              : props.uploader.slice(0, 48) + '...'}
          </div>
        </div>
        <div className="date">
          <span>{props.uploadDate}</span> <AiOutlineClockCircle />
        </div>
      </div>
    </StyledItem>
  );
}
