import styled from "styled-components";
import themes from "../../../styles/themes";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: ${themes.screen.s}) {
    bottom: 5vh;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 2rem;
    justify-content: space-evenly;
    margin: unset;
    padding: 2rem 0;
    user-select: none;
  }

  li {
    width: 32px;
    aspect-ratio: 1;
    border-radius: 100%;
    overflow: hidden;
    display: grid;
    place-items: center;
    font-weight: bold;
    border: 2px solid ${({ theme }) => theme.colors.secondaryVariant};
    color: ${({ theme }) => theme.colors.secondaryVariant};
  }

  .active {
    border: 2px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function Pagination({ active }: { active: number }) {
  return (
    <Container>
      <ul>
        {[1, 2, 3].map((i) => (
          <li key={i} className={i === active ? "active" : ""}>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default Pagination;
