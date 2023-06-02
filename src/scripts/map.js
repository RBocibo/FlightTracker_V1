let marker;
let map;

function showMarker(latitude, longitude) {
  const mapContainer = document.querySelector("#map");

  if (!map) {
    map = L.map(mapContainer, {
      center: [latitude, longitude],
      zoom: 10,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  } else {
    map.setView([latitude, longitude], 10);
  }

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([latitude, longitude]);
  console.log("marker created", marker);

  marker.addTo(map);
}

export { showMarker };
