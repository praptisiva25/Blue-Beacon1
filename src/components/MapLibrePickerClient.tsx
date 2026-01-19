"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

export default function MapLibrePickerClient({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapRefInstance = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapRefInstance.current) return;

    const initializeMap = (lng: number, lat: number) => {
      // 1️⃣ Create map
      mapRefInstance.current = new maplibregl.Map({
        container: mapRef.current!,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [lng, lat],
        zoom: 16,
      });

      // 2️⃣ Add search (Nominatim)
      const geocoder = new MaplibreGeocoder(
        {
          forwardGeocode: async (config) => {
            const query =
              Array.isArray(config.query)
                ? config.query.join(", ")
                : String(config.query ?? "");

            const resp = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
              )}`
            );
            const data = await resp.json();

            return {
              type: "FeatureCollection",
              features: data.map((item: any) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    parseFloat(item.lon),
                    parseFloat(item.lat),
                  ],
                },
                place_name: item.display_name,
                properties: {},
              })),
            };
          },
        },
        { maplibregl }
      );

      mapRefInstance.current.addControl(geocoder, "top-left");

      // 🔥 Force zoom & pan when search result is selected
            geocoder.on("result", (e) => {
              const geom = e.result.geometry;
              if (!geom) return;
      
              if (geom.type === "Point") {
                const [lng, lat] = (geom as GeoJSON.Point).coordinates;
      
                mapRefInstance.current?.flyTo({
                  center: [lng, lat],
                  zoom: 16,
                });
              } else if (geom.type === "GeometryCollection") {
                const point = (geom as GeoJSON.GeometryCollection).geometries.find(
                  (g) => g.type === "Point"
                ) as GeoJSON.Point | undefined;
                if (point) {
                  const [lng, lat] = point.coordinates;
      
                  mapRefInstance.current?.flyTo({
                    center: [lng, lat],
                    zoom: 16,
                  });
                }
              }
            });

      // 3️⃣ Map controls
      mapRefInstance.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );

      // 4️⃣ Click to place marker
      mapRefInstance.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        if (markerRef.current) {
          markerRef.current.remove();
        }

        markerRef.current = new maplibregl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRefInstance.current!);

        onSelect(lat, lng);
      });
    };

    // 5️⃣ Try to center on user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        initializeMap(pos.coords.longitude, pos.coords.latitude);
      },
      () => {
        // Fallback: India center
        initializeMap(78.9629, 20.5937);
      }
    );
  }, [onSelect]);

  return <div ref={mapRef} style={{ height: "300px", width: "100%" }} />;
}
