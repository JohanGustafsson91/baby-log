export const ensureArray = (input: string | string[] | undefined): string[] => {
  if (input === undefined) {
    return [];
  } else if (typeof input === "string") {
    return [input];
  } else {
    return input;
  }
};
