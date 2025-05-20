import styled from "styled-components";
import { HiOutlinePlay } from "react-icons/hi";

const StyledLogo = styled.span`
  color: ${({ theme }) => theme.colors.logo};
  display: flex;
  gap: 0.5rem;
  align-items: center;

  svg {
    font-size: 2rem;
  }

  img {
    width: 110px
  }
`;

function Logo() {
  return (
    <StyledLogo>
      <img src="/images/plays-logo.png"></img>
    </StyledLogo>
  );
}

export default Logo;
