/**
 * Equaatable
 *
 * THe Equatable Interface determines equality.
 */

export interface Equatable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals(suspect: any): boolean;
}
