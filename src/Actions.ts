export enum Actions {
  ADD_DEVICE = "1",
  SHOW_NETWORK = "2",
  EXIT = "9",
}

export namespace Actions {
  export function parse(input: string): Actions | null {
    if (Object.values(Actions).includes(input as Actions)) {
      return input as Actions;
    }
    return null; // Return null if the input doesn't match any enum value
  }
  export function isValid(input: Actions): boolean {
    return Object.values(Actions).includes(input);
  }
}
