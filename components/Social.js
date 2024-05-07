import React from "react";

function Social() {
  const handleClick = () => {
    window.location.href = "https://google.com"; // Replace 'https://example.com' with the desired URL
  };
  const handleClickk = () => {
    window.location.href = "https://google.com"; // Replace 'https://example.com' with the desired URL
  };

  return (
    <div>
      <div className="social-heading">Want to reach us ? try</div>
      <div className="social-link" onClick={handleClick}>
        https://google.com
      </div>
      <div className="parent-container">
        <div className="child-container">
          <img
            src="./images/instagram.png"
            className="image-icon "
            onClick={handleClick}
          />
        </div>
        <div className="child-container">
          <img
            src="./images/twitter.png"
            className="image-icon-left "
            onClick={handleClickk}
          />
        </div>
      </div>
    </div>
  );
}

export default Social;
