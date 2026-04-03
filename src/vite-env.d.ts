/// <reference types="vite/client" />

declare module "*.svg?react" {
  import * as React from "react";
  const ReactComponent: React.VFC<
    React.SVGProps<SVGSVGElement> & { title?: string; desc?: string }
  >;
  export default ReactComponent;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
