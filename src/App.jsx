import React, { useRef, useEffect, useState } from "react";
import { Map, Marker, Popup } from "react-leaflet";
import { Input, Button } from "antd";
import './App.css'

import { CRS } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconShadow from "leaflet/dist/images/marker-shadow.png";


const App = () => {
  const mapRef = useRef(null);

  const [text, setText] = useState("");

  useEffect(() => {
    const map = mapRef.current.leafletElement;
    const bounds = [
      [0, 0],
      [100, 100],
    ];
    const image = L.imageOverlay(
      "https://www.akc.org/wp-content/uploads/2017/11/Samoyed-standing-in-the-forest.jpg",
      bounds
    ).addTo(map);

    map.fitBounds(image.getBounds());
  }, []);

  const [markers, setMarkers] = useState([]);

  const removeMarker = (lat) => {
    const temp = markers.filter((marker) => marker.lat !== lat);

    setMarkers([...temp]);
  };

  const handleClick = (event, id) => {
    const coordinates = event.latlng;

    const temp = markers.filter((marker) => marker.lat !== coordinates.lat);

    setMarkers([...temp, { ...coordinates, id }]);
  };

  const handleAddComment = (id) => {
    const newMakers = [...markers].map((marker) => {
      if(marker.id == id) marker = {...marker, text }

      return marker
    })
    setMarkers((prev) => prev = [...newMakers]);

    setText("");
  };

  return (
    <div className="App">
      <div className="d-flex justify-content-between">
        <div style={{ width: "70vw" }}>
          <Map
            ref={mapRef}
            minZoom={0}
            crs={CRS.Simple}
            maxBoundsViscosity={1.0}
            boundsOptions={{ padding: [50, 50] }}
            style={{ height: "100vh" }}
            onClick={(e) => handleClick(e, markers.length + 1)}
          >
            {markers?.map((coordinates, index) => (
              <Marker key={index} position={coordinates} icon={L.divIcon({className: "marker-icon",
                shadowUrl: iconShadow,
                iconAnchor: [17, 46],
                html: `<span class="icon-text">${coordinates.id || index+1}</span>`
              })}>
                <Popup>
                  <div className="py-2 px-1" style={{ width: 300 }}>
                    <Input
                      placeholder={`Add something for coordinate${coordinates.id}`}
                      value={coordinates.text}
                      onChange={(event) => setText(event.target.value)}
                    />
                    <div className="mt-3 d-flex justify-content-end">
                      <Button
                        className="ms-3"
                        type="primary"
                        onClick={() => handleAddComment(index + 1)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>
        <div className="px-4" style={{ width: "30vw", height: "100vh" }}>
          <div className="h-100 overflow-auto">
            {markers?.map((coordinates, index) => (
              <div key={index}>
                <div className="d-flex justify-content-between">
                  <p>Coordinate {coordinates.id}: </p>

                  <div style={{ marginLeft: "20px" }}>
                    <p>Lat: {coordinates.lat}</p>
                    <p>Long: {coordinates.lng}</p>
                    {coordinates.text ? <p>Comment: {coordinates.text}</p> : ""}
                  </div>

                  <p
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => removeMarker(coordinates.lat)}
                  >
                    Remove
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
