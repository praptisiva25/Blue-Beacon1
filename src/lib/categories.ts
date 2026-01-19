export const CATEGORIES = {
  PUBLIC_SAFETY: {
    STRUCTURAL_RISK: [
      "BRIDGE_COLLAPSE",
      "BUILDING_CRACKS",
      "OPEN_MANHOLE",
    ],
    ELECTRICAL: [
      "EXPOSED_WIRES",
      "TRANSFORMER_RISK",
    ],
  },

  ENVIRONMENT: {
    WATER_POLLUTION: [
      "OIL_SPILL",
      "SEWAGE_OVERFLOW",
    ],
    WASTE: [
      "GARBAGE_DUMPING",
      "PLASTIC_WASTE",
    ],
  },

  TRANSPORT: {
    ROAD_DAMAGE: [
      "POTHOLES",
      "BROKEN_SIGNAGE",
    ],
  },
} as const;
