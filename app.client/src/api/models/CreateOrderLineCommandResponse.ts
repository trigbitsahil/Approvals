/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderLineDto } from './CreateOrderLineDto';
export type CreateOrderLineCommandResponse = {
    success?: boolean;
    message?: string | null;
    validationErrors?: Array<string> | null;
    data?: CreateOrderLineDto;
};
