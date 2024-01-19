export declare const arrayOfAll: <T>() => <U extends T[]>(array: U & ([T] extends [U[number]] ? unknown : "Invalid")) => U & ([T] extends [U[number]] ? unknown : "Invalid");
export default arrayOfAll;
