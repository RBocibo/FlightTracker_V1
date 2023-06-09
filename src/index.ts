import "./styles/style.css";
import "../src/images/flight-logo.png";
import { getAllStates } from "./scripts/tracking-ongoing-flights";
import { fromEvent } from "rxjs";

const buttonListStates = document.getElementById("buttonListStates");

if(buttonListStates) {
    const buttonListStatesClicks$ = fromEvent(buttonListStates, "click");

    buttonListStatesClicks$.subscribe(() => {
        getAllStates();
    });
}