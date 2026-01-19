"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("./LocationPickerClient"),
  { ssr: false }
);

export default LocationPicker;
