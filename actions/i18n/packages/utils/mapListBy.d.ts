export declare function mapListBy<T extends Record<string | number | symbol, any>>(array?: T[], key?: keyof T): Record<T[keyof T], T>;
export default mapListBy;
