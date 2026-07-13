import React, { DOMAttributes } from 'react';
import { Property } from 'csstype';
import Vector2 from '../geometry/Vector2';
import { AnchorPositionType, ValidLineStyles } from '../types';
declare type Props = {
    className?: string;
    startingPoint: Vector2;
    startingAnchorOrientation: AnchorPositionType;
    endingPoint: Vector2;
    endingAnchorOrientation: AnchorPositionType;
    strokeColor: string;
    strokeWidth: number;
    strokeDasharray?: string;
    arrowLabel?: React.ReactNode | null | undefined;
    arrowMarkerId: string;
    lineStyle: ValidLineStyles;
    offset?: number;
    enableStartMarker?: boolean;
    disableEndMarker?: boolean;
    endShape: Record<string, any>;
    domAttributes?: DOMAttributes<SVGElement>;
    hitSlop?: number;
    cursor?: Property.Cursor;
};
export declare function computeArrowPointAccordingToArrowHead(xArrowHeadPoint: number, yArrowHeadPoint: number, arrowLength: number, strokeWidth: number, endingAnchorOrientation: AnchorPositionType, lineStyle?: ValidLineStyles, xArrowStart?: number, yArrowStart?: number): {
    xPoint: number;
    yPoint: number;
};
export declare function computeStartingAnchorPosition(xStart: number, yStart: number, xEnd: number, yEnd: number, startingAnchorOrientation: AnchorPositionType): {
    xAnchor1: number;
    yAnchor1: number;
};
export declare function computeEndingAnchorPosition(xStart: number, yStart: number, xEnd: number, yEnd: number, endingAnchorOrientation: AnchorPositionType): {
    xAnchor2: number;
    yAnchor2: number;
};
export declare function computeLabelDimensions(xStart: number, yStart: number, xEnd: number, yEnd: number): {
    xLabel: number;
    yLabel: number;
    labelWidth: number;
    labelHeight: number;
};
declare const SvgArrow: ({ className, startingPoint, startingAnchorOrientation, endingPoint, endingAnchorOrientation, strokeColor, strokeWidth, strokeDasharray, arrowLabel, arrowMarkerId, lineStyle, offset, enableStartMarker, disableEndMarker, endShape, domAttributes, hitSlop, cursor, }: Props) => JSX.Element;
export default SvgArrow;
