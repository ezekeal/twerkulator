export const stringToCharCodes = (str: string): number[] =>
    str.split('').map((char: string) => char.charCodeAt(0));

export const arrayBufferToString = (
    buffer: ArrayBuffer | SharedArrayBuffer
): string => String.fromCharCode.apply(null, new Uint8Array(buffer));

export const stringToArrayBuffer = (str: string): ArrayBuffer =>
    Uint8Array.from(stringToCharCodes(str)).buffer;
