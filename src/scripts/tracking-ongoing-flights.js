import { map, polyline } from "leaflet";
import { showMarker } from "./map";

function getAllStates() {
  const itemsPerPage = getFlightsPerPage();
  const flights = [];
  let currentPage = 1;

  fetch("https://opensky-network.org/api/states/all")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((data) => {
      flights.push(...data.states);
      displayFlights(currentPage);
    })
    .catch((error) => {
      if (error.message === "404") {
        showNoFlightPopup();
      } else {
        console.log("Error:", error);
      }
    });

  function displayFlights(page) {
    const flightsTable = document.getElementById("flightsTable");
    flightsTable.innerHTML = "";

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageFlights = flights.slice(startIndex, endIndex);

    for (const flight of pageFlights) {
      const row = document.createElement("tr");
      row.addEventListener("click", function () {
        showFlightDetails(flight);
      });

      const icao24 = document.createElement("td");
      icao24.textContent = flight[0];
      row.appendChild(icao24);

      const callsign = document.createElement("td");
      callsign.textContent = flight[1];
      row.appendChild(callsign);

      const originCountry = document.createElement("td");
      originCountry.textContent = flight[2];
      row.appendChild(originCountry);

      flightsTable.appendChild(row);
    }

    updatePagination();
  }

  function updatePagination() {
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const currentPageIndicator = document.getElementById("currentPage");

    const totalPages = Math.ceil(flights.length / getFlightsPerPage());

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    currentPageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  function showFlightDetails(flight) {
    const popup = window.open("", "_blank", "width=400,height=300");
    popup.document.write(`
                <html>
                <head>
                    <title>Flight Details</title>
                </head>
                <body>
                    <h2>Flight Details</h2>
                    <p><strong>ICAO24:</strong> ${flight[0]}</p>
                    <p><strong>Callsign:</strong> ${flight[1]}</p>
                    <p><strong>Origin Country:</strong> ${flight[2]}</p>
                    <p><strong>time_position:</strong> ${flight[3]}</p>
                    <p><strong>last_contact:</strong> ${flight[4]}</p>
                    <p><strong>longitude:</strong> ${flight[5]}</p>
                    <p><strong>latitude:</strong> ${flight[6]}</p>
                    <p><strong>baro_altitude:</strong> ${flight[7]}</p>
                    <p><strong>on_ground:</strong> ${flight[8]}</p>
                </body>
                </html>
            `);
    popup.document.close();

    const icao24 = flight[0];

    fetch(`https://opensky-network.org/api/tracks/all?icao24=${icao24}&time=0`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }

        return response.json();
      })
      .then((data) => {
        if (data && data.path && data.path.length > 0) {
          const track = data.path;

          const lastPosition = track[track.length - 1];
          const latitude = lastPosition[1];
          const longitude = lastPosition[2];

          showMarker(latitude, longitude);
        }
      })
      .catch((error) => {
        if (error.message === "404") {
          showNoFlightToTrackPopup();
        } else {
          console.log("Error:", error);
        }
      });
  }

  document.getElementById("prevPageBtn").addEventListener("click", function () {
    currentPage--;
    displayFlights(currentPage);
  });

  document.getElementById("nextPageBtn").addEventListener("click", function () {
    currentPage++;
    displayFlights(currentPage);
  });
}

function getFlightsPerPage() {
  if (window.matchMedia("(max-width: 500px)").matches) {
    return 4;
  } else {
    return 20;
  }
}

function showNoFlightPopup() {
  alert("The flight doesn't have tracks");
}

function showNoFlightToTrackPopup() {
  alert("The flight doesn't have tracks");
}

window.addEventListener("DOMContentLoaded", () => {
  showMarker(0, 0);
});

function getFlightLifeTrack() {
  fetch("https://opensky-network.org/api/tracks/all?icao24=a545d8&time=0")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.path && data.path.length > 0) {
        const tracks = data.path;

        const tableBody = document.querySelector("#flight-table tbody");

        tableBody.innerHTML = "";

        tracks.forEach((track) => {
          const time = new Date(track[0] * 1000).toLocaleString();
          const latitude = track[1];
          const longitude = track[2];
          const baroAltitude = track[3];
          const trueTrack = track[5];
          const onGround = track[6];

          const row = document.createElement("tr");
          const timeCell = document.createElement("td");
          timeCell.textContent = time;
          row.appendChild(timeCell);

          const latitudeCell = document.createElement("td");
          latitudeCell.textContent = latitude;
          row.appendChild(latitudeCell);

          const longitudeCell = document.createElement("td");
          longitudeCell.textContent = longitude;
          row.appendChild(longitudeCell);

          const baroAltitudeCell = document.createElement("td");
          baroAltitudeCell.textContent = baroAltitude;
          row.appendChild(baroAltitudeCell);

          const trueTrackCell = document.createElement("td");
          trueTrackCell.textContent = trueTrack;
          row.appendChild(trueTrackCell);

          const onGroundCell = document.createElement("td");
          onGroundCell.textContent = onGround;
          row.appendChild(onGroundCell);

          tableBody.appendChild(row);
        });

        const lastTrack = tracks[tracks.length - 1];
        const lastLatitude = lastTrack[1];
        const lastLongitude = lastTrack[2];

        showMarker(lastLatitude, lastLongitude);
      } else {
        console.log("No track data available.");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

export { getAllStates };
export { getFlightLifeTrack };
