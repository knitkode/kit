export declare function moveSortableArrayItemByKey<T, K extends keyof T>(items: T[], key: K, fromItem: Pick<T, K>, toItem: Pick<T, K>): T[];
export default moveSortableArrayItemByKey;
