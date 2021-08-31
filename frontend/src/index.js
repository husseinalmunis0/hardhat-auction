import React from "react";
import ReactDOM from "react-dom";
import { CreateAuction } from "./components/CreateAuction";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import ShowAuctions from "./components/ShowAuctions";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
      <ShowAuctions/>
      <CreateAuction/>
  </React.StrictMode>,
  document.getElementById("root")
);
