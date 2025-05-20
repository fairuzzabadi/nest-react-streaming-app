import styled from "styled-components";
import themes from "../../../styles/themes";

const StyledVideoList = styled.ul`
  display: grid;
  gap: 1rem;
  // grid-auto-rows: 360px;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  padding: unset;
  margin-top: 1.5rem;
  padding-right: 2rem;

  h2 {
    display: none;
  }

  @media (max-width: ${themes.screen.l}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${themes.screen.s}) {
    grid-template-columns: 1fr;
   
    h2 {
      display: block;
      text-align: center;
    }

    .new-video-btn {
      display: none;
    }
  }
`;

export default StyledVideoList;
