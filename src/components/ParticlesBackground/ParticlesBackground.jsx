import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import config from "./particlesjs-config.json";

export default function ParticlesBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };
  const particlesLoaded = (container) => {};
  return (
    <div>
      <Particles id="tsParticles" init={particlesInit} loaded={particlesLoaded} options={config} />
    </div>
  );
}
