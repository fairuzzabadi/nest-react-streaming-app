import { rgba, transparentize } from "polished";
import { useContext, useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { keyframes, styled } from "styled-components";
import api from "../api";
import ThemeContext from "../contexts/theme";
import themes from "../styles/themes";

const appears = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const nameAppears = keyframes`
  from {
    opacity: 0;
    transform: translateX(50%);
  } to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Container = styled.nav`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;

  .left {
    display: flex;
    gap: 1rem;
    margin-left: 2rem;

    @media (max-width: ${themes.screen.l}) {
      display: none;
    }
  }

  .menu-btn {
    all: unset;
    display: none;
    margin-left: 1.25rem;
    outline: 2px solid
      ${({ theme }) => transparentize(0.75, theme.colors.primary)};
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.5rem;
    border-radius: 5px;

    @media (max-width: ${themes.screen.m}) {
      display: grid;
      place-items: center;
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1.75rem;
    animation: ${appears} 500ms both;

    & > * {
      cursor: pointer;
      color: ${({ theme }) => theme.colors.primary};
    }

    button {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      font-size: 1.25rem;
      border: none;
      outline: none;
      border-radius: 5rem;
      background: transparent;
      transition: background 500ms;

      &:hover {
        background: ${({ theme }) => rgba(theme.colors.primary, 0.125)};
      }
    }

    .incoming {
      position: relative;

      &::after {
        display: block;
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 5rem;
        background: ${({ theme }) => theme.colors.quaternary};
        right: 6px;
        top: 6px;
      }
    }
  }

  .searchbar {
    position: relative;

    label {
      position: absolute;
      top: 0.95rem;
      left: 1rem;
    }

    input {
      height: 100%;
      width: 100%;
      outline: none;
      padding: 0;
      padding-left: 3rem;
      border: 1px solid ${({ theme }) => rgba(theme.colors.primary, 0.25)};
      border-radius: 1rem;
      min-width: ${({ theme }) => theme.sizes.inputWidth};
      background: transparent;
      color: ${({ theme }) => theme.colors.primary};

      &:focus {
        border: 1px solid ${({ theme }) => theme.colors.secondaryVariant};
      }
    }
  }

  .buttons {
    display: flex;

    button {
      outline: none;
      border: none;
      display: grid;
      place-items: center;
      padding: 0.75rem;
      border-radius: 10rem;
      font-size: 1.5rem;
      cursor: pointer;
      background: transparent;
      transition: background 250ms;
      color: ${({ theme }) => theme.colors.primary};

      &[disabled] {
        color: ${({ theme }) => rgba(theme.colors.primary, 0.25)};
      }

      &:hover {
        background: ${({ theme }) => rgba(theme.colors.primary, 0.125)};
      }

      &:active {
        box-shadow: 1px 1px 5px
          ${({ theme }) => rgba(theme.colors.primary, 0.265)} inset;
      }
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .name {
      font-weight: bold;
      margin-left: 0.5rem;
      animation: ${nameAppears} 500ms 750ms both;

      @media (max-width: ${themes.screen.m}) {
        display: none;
      }
    }
  }

  .profil {
    padding: 2px;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 10rem;
    display: grid;
    place-items: center;

    div {
      width: 32px;
      aspect-ratio: 1;
      background-size: cover;
      border-radius: 10rem;
    }
  }
`;

function Header({ showSidebar }: { showSidebar: () => void }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState("/images/profile-pic.png");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id && localStorage.getItem("token")) {
      api
        .get(`user/${id}`)
        .then((res) => {
          const user = res.data;

          const names: string[] = user.fullname.split(" ");
          let name = names[0];
          if (names.length >= 1) {
            for (let i = 1; i < names.length; ++i) {
              name += ` ${names[i][0]}.`;
            }
          }
          setUserName(name);

          if (user.avatar) {
            setUserPicture(
              `${import.meta.env.VITE_API_ENDPOINT}/user/picture/${user.avatar}`
            );
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <Container>
      <div className="right">
        <button>
          <GoBell />
        </button>
        <button onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        <div className="user">
          <span className="name">{userName}</span>
          <div className="profil">
            <div
              style={{
                backgroundColor: "white",
                backgroundImage: `url(${userPicture})`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="left">
        <div className="buttons">
          <button disabled>
            <IoIosArrowBack />
          </button>
          <button>
            <IoIosArrowForward />
          </button>
        </div>
        <div className="searchbar">
          <label htmlFor="search-input">
            <FiSearch />
          </label>
          <input type="text" id="search-input" placeholder="Search video..." />
        </div>
      </div>
      <button className="menu-btn" onClick={showSidebar}>
        <BiMenuAltLeft />
      </button>
    </Container>
  );
}

export default Header;
