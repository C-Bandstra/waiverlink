import React, { useLayoutEffect, useRef, useState } from "react";
import { denormalizePosition } from "../utils/templateBuild";

const FieldWrapper = ({
  field,
  previewWidth,
  previewHeight,
  children,
}: {
  field: any;
  previewWidth: number;
  previewHeight: number;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ width: 0, height: 0 });

  const { x, y } = denormalizePosition(
    field.position.x,
    field.position.y,
    previewWidth,
    previewHeight
  );

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      //subtract 1 from rect height (update later if needed)
      setOffset({ width: rect.width, height: (rect.height - 1) });
    }
  }, [children]);

  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y - offset.height}px`, // Align bottom edge to y
        transform: "translate(0, 0)",
      }}
    >
      {children}
    </div>
  );
};

export default FieldWrapper;
