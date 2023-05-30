import style from "./styles/style.css";
import image from '../src/images/flight-logo.png';
import image2 from './scripts/tracking-ongoing-flights.js';
import { getAllStates } from './scripts/tracking-ongoing-flights';
import { getFlightLifeTrack } from "./scripts/tracking-ongoing-flights";
import {showMarker} from "./scripts/tracking-ongoing-flights";

document.getElementById('buttonListStates').addEventListener('click' , getAllStates);
document.getElementById('buttonFlightLifeTrack').addEventListener('click', getFlightLifeTrack);