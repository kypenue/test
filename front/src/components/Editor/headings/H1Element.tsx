import { PlateElement, type PlateElementProps } from "@platejs/core/react";

export const H1Element = (props: PlateElementProps) => {
    return <PlateElement as="h1" {...props} />;
};
