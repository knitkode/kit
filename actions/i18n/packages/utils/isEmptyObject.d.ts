export declare function isEmptyObject(payload: any): payload is {
    [K in any]: never;
};
export default isEmptyObject;
