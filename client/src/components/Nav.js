import whiteLogo from "../images/whitelogo.png";
import colorLogo from "../images/logo.png";

const Nav = ({ authToken, minimal, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = (e) => {
    e.preventDefault(); // Prevent default action if necessary
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img
          className="logo"
          src={minimal ? colorLogo : whiteLogo}
          alt="Company logo"
        />
      </div>
      {!authToken && !minimal && (
        <button
          className="nav-button"
          onClick={handleClick}
          disabled={showModal}
          aria-label="Log in" // Adding aria-label for accessibility
          style={{ cursor: showModal ? 'not-allowed' : 'pointer', opacity: showModal ? 0.5 : 1 }} // Visual feedback
        >
          Log in
        </button>
      )}
    </nav>
  );
};

export default Nav;
