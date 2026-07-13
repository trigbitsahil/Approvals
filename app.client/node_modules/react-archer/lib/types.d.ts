import { DOMAttributes } from 'react';
import { Property } from 'csstype';
export declare type ValidLineStyles = 'angle' | 'straight' | 'curve';
export declare type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right' | 'middle';
export declare type RelationType = {
    targetId: string;
    targetAnchor: AnchorPositionType;
    sourceAnchor: AnchorPositionType;
    order?: number;
    label?: React.ReactNode | null | undefined;
    className?: string;
    style?: LineType;
    domAttributes?: DOMAttributes<SVGElement>;
    /** Allows to make the mouse selectable arrow thicker */
    hitSlop?: number;
    /** Allows to customize the hovering cursor for a selectable arrow */
    cursor?: Property.Cursor;
};
export declare type EntityRelationType = {
    id: string;
    anchor: AnchorPositionType;
};
export declare type SourceToTargetType = {
    className?: string;
    source: EntityRelationType;
    target: EntityRelationType;
    order: number;
    label?: React.ReactNode | null | undefined;
    style?: LineType;
    domAttributes?: DOMAttributes<SVGElement>;
    hitSlop?: number;
    cursor?: Property.Cursor;
};
export declare type ArrowShapeType = {
    arrowLength?: number;
    arrowThickness?: number;
};
export declare type CircleShapeType = {
    radius?: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
};
export declare type ShapeType = {
    arrow?: ArrowShapeType;
    circle?: CircleShapeType;
};
export declare type LineType = {
    endShape?: ShapeType;
    strokeColor?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    noCurves?: boolean;
    startMarker?: boolean;
    endMarker?: boolean;
    lineStyle?: ValidLineStyles;
};
export declare type ValidShapeTypes = 'arrow' | 'circle';
