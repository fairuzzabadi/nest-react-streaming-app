import styled from "styled-components";
import { AiTwotoneHeart } from "react-icons/ai";
import { FaRegCompass } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../../../components";
import { rgba, transparentize } from "polished";
import { Link } from "react-router-dom";
import themes from "../../../styles/themes";
import { createPortal } from "react-dom";

type Link = {
  icon: React.JSX.Element;
  label: string;
  to?: string;
  action?: () => void;
};

type Section = {
  label: string;
  links: Link[];
};

const Container = styled.nav<{ $show: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 180px;
  max-width: 280px;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.background};
  padding-top: 1rem;
  border-right: 2px solid ${({ theme }) => rgba(theme.colors.secondary, 0.3)};
  transition: transform 250ms ease-out, opacity 250ms;

  @media (max-width: ${themes.screen.m}) {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 2;
    padding: 0;
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    transform: ${({ $show }) => ($show ? "translate(0)" : "translateX(-100%)")};
    box-shadow: 0 0 15px
      ${({ theme }) => transparentize(0.75, theme.colors.primary)};
  }

  ul {
    list-style: none;
    padding: unset;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  .section > p {
    font-size: 0.75rem;
    padding-left: 1.75rem;
    color: ${({ theme }) => theme.colors.secondaryVariant};
  }

  .logo {
    margin: 1rem 0;
    padding-left: 1.75rem;
    user-select: none;
  }
`;

const StyledLink = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.75rem;
  position: relative;
  background: transparent;
  transition: background 250ms;

  & > a {
    color: ${({ theme, $active }) =>
      $active
        ? theme.colors.primary
        : rgba(theme.colors.primary, 0.6)} !important;
  }

  & > svg {
    color: ${({ theme, $active }) =>
      $active
        ? theme.colors.quaternary
        : rgba(theme.colors.primary, 0.6)} !important;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }

  &::before {
    position: absolute;
    left: 1px;
    border-radius: 5px;
    display: ${({ $active }) => ($active ? "block" : "none")};
    content: "";
    width: 5px;
    height: 1.5rem;
    background: ${({ theme }) => theme.colors.quaternary};
  }

  svg {
    font-size: 1.25rem;
  }

  a {
    flex-grow: 1;
    padding: 0.5rem 0;
  }
`;

const StyledBluredBackground = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  backdrop-filter: blur(2px);

  @media (max-width: ${themes.screen.m}) {
    display: block;
  }
`;

const BluredBackground = ({ onClick }: { onClick: () => void }) => {
  const container = document.querySelector("#modal-portal");
  if (container === null) return null;
  return createPortal(<StyledBluredBackground onClick={onClick} />, container);
};

function Sidebar({ show, hide }: { show: boolean; hide: () => void }) {
  const sections: Section[] = [
    {
      label: "Menu",
      links: [
        {
          icon: <AiTwotoneHeart />,
          label: "My Videos",
          to: "/",
        },
        {
          icon: <FaRegCompass />,
          label: "Explore",
          to: "/explore",
        },
      ],
    },
    {
      label: "General",
      links: [
        {
          label: "Settings",
          icon: <BsGear />,
          to: "/settings",
        },
        {
          label: "Log out",
          icon: <IoExitOutline />,
          action() {
            localStorage.clear();
            navigate("/login");
          },
        },
      ],
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const activeLink = useMemo(() => {
    const path = location.pathname;
    for (let section of sections) {
      const link = section.links.find((link) => path === link.to);
      if (link) {
        return link.label;
      }
    }
    return null;
  }, [location]);

  return (
    <Container $show={show}>
      <h1 className="logo">
        <Logo />
      </h1>
      {sections.map((section, i) => (
        <div className="section" key={i}>
          <p>{section.label}</p>
          <ul>
            {section.links.map((link) => (
              <StyledLink key={link.label} $active={link.label === activeLink}>
                {link.icon}
                {link.action ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      link.action!();
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.to!}>{link.label}</Link>
                )}
              </StyledLink>
            ))}
          </ul>
        </div>
      ))}
      {show && <BluredBackground onClick={hide} />}
    </Container>
  );
}

export default Sidebar;
