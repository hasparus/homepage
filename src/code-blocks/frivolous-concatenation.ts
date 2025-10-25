export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

export declare function twMerge(...classLists: ClassValue[]): string;
export declare function clsx(...inputs: ClassValue[]): string;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
