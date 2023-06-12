import { Observable, fromEvent } from "rxjs";
import { showMarker } from "./map";

function getAllStates() {
  const itemsPerPage = getFlightsPerPage();
  const flights: any = [];
  let currentPage: number = 1;

  const fetchFlights$ = new Observable((observer: any) => {
    fetch("https://opensky-network.org/api/states/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status.toString());
        }

        return response.json();
      })
      .then((data) => {
        observer.next(flights.push(...data.states.slice(0,50)));
        observer.next(displayFlights(currentPage));
        observer.complete();
      })
      .catch((error) => {
        showNoFlightPopup();
        observer.error(error);
      });
  });
  fetchFlights$.subscribe();

  function displayFlights(page: number) {
    const flightsTable: HTMLElement | null =
      document.getElementById("flightsTable");
    if (flightsTable) {
      flightsTable.innerHTML = "";
    }

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

      if (flightsTable) {
        flightsTable.appendChild(row);
      }
    }

    if (typeof Storage !== "undefined") {
      localStorage.setItem("flights", JSON.stringify(flights));
    }

    updatePagination();
  }

  function updatePagination() {
    const prevPageBtn: HTMLButtonElement | null = document.getElementById(
      "prevPageBtn"
    ) as HTMLButtonElement;
    const nextPageBtn: HTMLButtonElement | null = document.getElementById(
      "nextPageBtn"
    ) as HTMLButtonElement;
    const currentPageIndicator = document.getElementById("currentPage");

    const totalPages = Math.ceil(flights.length / getFlightsPerPage());

    if (prevPageBtn && nextPageBtn && currentPageIndicator) {
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;

      currentPageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    }
  }

  function showFlightDetails(flight: any) {
    const popup: Window | null = window.open(
      "",
      "_blank",
      "width=400,height=300"
    );

    if (popup) {
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
    }

    const icao24 = flight[0];

    fetch(`https://opensky-network.org/api/tracks/all?icao24=${icao24}&time=0`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status.toString());
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
        if (error.message === "404" || error.message === "500") {
          showNoFlightToTrackPopup();
        } else {
          console.log("Error:", error);
        }
      });
  }

  const previousButton = document.getElementById("prevPageBtn");

  if (previousButton) {
    const previousButtonObservable$ = fromEvent(previousButton, "click");

    previousButtonObservable$.subscribe(() => {
      currentPage--;
      displayFlights(currentPage);
    });
  }

  const nextButton = document.getElementById("nextPageBtn");

  if (nextButton) {
    const nextButtonObservable$ = fromEvent(nextButton, "click");

    nextButtonObservable$.subscribe(() => {
      currentPage++;
      displayFlights(currentPage);
    });
  }
}

function getFlightsPerPage() {
  if (window.matchMedia("(max-width: 500px)").matches) {
    return 3;
  } else {
    return 10;
  }
}

function showNoFlightPopup() {
  alert("No states for flights");
}

function showNoFlightToTrackPopup() {
  alert("The flight doesn't have tracks");
}

const domDocumentLoaded$ = new Observable((observer) => {
  window.addEventListener("DOMContentLoaded", () => {
    observer.next(showMarker(0, 0));
  });
});
domDocumentLoaded$.subscribe();

export { getAllStates };
