import * as React from "react";
import * as M from "@mantine/core";

export default function() {
  return <>
    <p>
    <M.List withPadding>
      <M.List.Item><strong>Paper submission deadline:</strong> 5 July 2024</M.List.Item>
      <M.List.Item><strong>Notification of acceptance:</strong> 7 August 2024</M.List.Item>
      <M.List.Item><strong>Camery-ready papers due:</strong> 16 August 2024</M.List.Item>
      <M.List.Item><strong>Workshop:</strong> between 22-27 September 2024 (exact date TBA)</M.List.Item>
    </M.List>
    </p>
  </>;
}