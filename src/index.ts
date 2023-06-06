import "./styles/style.css";
import "../src/images/flight-logo.png";
import { getAllStates } from "./scripts/tracking-ongoing-flights";

const buttonListStates = document.getElementById("buttonListStates");

if (buttonListStates) {
  buttonListStates.addEventListener("click", getAllStates);
}
