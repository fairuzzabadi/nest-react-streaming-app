import { IoTelescopeSharp } from "react-icons/io5";
import StyledVideolist from "./video-list.styled";
import { useVideos } from "../../../hooks";
import { VideoCard } from "../../../components";
import styled from "styled-components";

const StyledTitle = styled.h2`
  justify-content: center;
  margin-top: 3rem;
  text-align: center;
  font-size: 2rem;
`;

export default function Explore() {
  const { videos } = useVideos("/video/a");

  return (
    <div>
      <h1>
        <span>Discover</span>
        <IoTelescopeSharp />
      </h1>
      {videos.length > 0 ? (
        <StyledVideolist>
          {videos.map((video, i) => (
            <li key={i}>
              <VideoCard {...video} />
            </li>
          ))}
        </StyledVideolist>
      ) : (
        <StyledTitle><span>No video found 😕</span></StyledTitle>
      )}
    </div>
  );
}
