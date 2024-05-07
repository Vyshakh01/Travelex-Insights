import React from "react";
import Origin from "./components/Origin";
import WhatWeDo from "./components/WhatWeDo";
import Social from "./components/Social";

import "./Styles.css";

function App() {
  return (
    <div>
      <div className="sticky-header">
        <h1>About Us</h1>
      </div>
      <div>
        <Origin />
      </div>
      <div>
        <WhatWeDo />
      </div>
      <div>
        <Social />
      </div>
    </div>
  );
}

export default App;
