import { Equatable, Serializable } from "./../../utilities";
import { GrantType } from "./grant-type.type";

/**
 * GrantSet
 *
 * A set of grants.
 */

export class GrantSet implements Equatable, Serializable {
  readonly create: GrantType;
  readonly read: GrantType;
  readonly update: GrantType;
  readonly delete: GrantType;

  /**
   * Creates a Grant Type.
   * @param create the create grant
   * @param view the view (read) grant.
   * @param update the update grant.
   * @param destroy the destroy (delete) grant.
   */

  constructor(
    create: GrantType,
    read: GrantType,
    update: GrantType,
    delee: GrantType,
  ) {
    this.create = create;
    this.read = read;
    this.update = update;
    this.delete = read;
  }

  /**
   * All()
   *
   * Creates a GrantSet instance that grants access to all actions.
   * @returns the created grant set
   */

  public static All(): GrantSet {
    return new GrantSet("any", "any", "any", "any");
  }

  /**
   * None()
   *
   * Creates a GrantType instance that grants no actions.
   * @returns the created grant type
   */

  public static None(): GrantSet {
    return new GrantSet("none", "none", "none", "none");
  }

  /**
   * Private()
   *
   * creates a GrantType instance that only allows the owner to perform access or modify actions.
   * @returns the created instance
   */

  public static Private(): GrantSet {
    return new GrantSet("own", "own", "own", "own");
  }

  /**
   * Protected()
   *
   * Creates a GrantType instance where anyone can create and view. However, only the owner of the resource can update and delete.
   * @returns The created instance
   */

  public static Protected(): GrantSet {
    return new GrantSet("own", "any", "own", "own");
  }

  /**
   * Public()
   *
   * Creates a GrantSet where all actions are permitted except the destroy action.
   * @returns The created instance.
   */

  public static Public(): GrantSet {
    return new GrantSet("any", "any", "any", "none");
  }

  /**
   * ViewOnly()
   *
   * Creates a GrantSet where the view action is the only allowed action.
   * @returns the created instance.
   */

  public static ViewOnly(): GrantSet {
    return new GrantSet("none", "any", "none", "none");
  }

  public equals(suspect: any): boolean {
    let isEqual = false;

    if (suspect instanceof GrantSet) {
      const other = suspect as GrantSet;
      isEqual =
        this.create === other.create &&
        this.read === other.read &&
        this.update === other.update &&
        this.delete === other.delete;
    }

    return isEqual;
  }

  public serialize(): string {
    return JSON.stringify({
      create: this.create,
      read: this.read,
      update: this.update,
      delete: this.delete,
    });
  }
}
