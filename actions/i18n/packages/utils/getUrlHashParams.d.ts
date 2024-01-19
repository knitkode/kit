import { type AnyQueryParams } from "./location";
export declare function getUrlHashParams<T extends NonNullable<AnyQueryParams>>(hash?: string): T;
export default getUrlHashParams;
