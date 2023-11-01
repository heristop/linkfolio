"use client";
import React from "react";

const Analytics = () => {
  const token = process.env.NEXT_BEAM_TOKEN;

  if (!token) {
    return null;
  }

  return (
    <script
      src="https://beamanalytics.b-cdn.net/beam.min.js"
      data-token={token}
      async
    />
  );
};

export default Analytics;
