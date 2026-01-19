"use client";

import dynamic from "next/dynamic";

const MapLibrePicker = dynamic(
  () => import("./MapLibrePickerClient"),
  { ssr: false }
);

export default MapLibrePicker;
