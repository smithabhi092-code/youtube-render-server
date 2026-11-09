import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      title: "Your YouTube Video",
      subtitle: "Generated automatically by n8n",
      background: "#111111"
    }}
  />
);
