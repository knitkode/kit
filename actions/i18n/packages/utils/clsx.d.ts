type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];
export type ClsxClassValue = ClassValue;
export declare const clsx: (...args: ClassValue[]) => string;
export default clsx;
