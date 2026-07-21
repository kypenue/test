import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

import s from "./List.module.scss";

interface ListElementProps extends PlateElementProps {
    variant: "ul" | "ol";
}

export function ListElement({ variant, ...props }: ListElementProps) {
    return (
        <PlateElement as={variant} className={s[variant]} {...props}>
            {props.children}
        </PlateElement>
    );
}

export function BulletedListElement(props: PlateElementProps) {
    return <ListElement variant="ul" {...props} />;
}

export function NumberedListElement(props: PlateElementProps) {
    return <ListElement variant="ol" {...props} />;
}

export function TaskListElement(props: PlateElementProps) {
    return (
        <PlateElement as="ul" className="m-0 list-none! py-1 ps-6" {...props}>
            {props.children}
        </PlateElement>
    );
}

export function ListItemElement(props: PlateElementProps) {
    return (
        <PlateElement as="li" {...props}>
            {props.children}
        </PlateElement>
    );
}
