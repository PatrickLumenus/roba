// permission utils
import { GrantType } from "../grant-set";
import { Actions } from "./../../actions";

/**
 * createScopeString()
 *
 * creates a scope string.
 * @param resourceName the resource name
 * @param action the action
 * @param grant the grant type
 * @returns the formatted scope string.
 */

export const createScopeString = (
  resourceName: string,
  action: Actions,
  grant: GrantType
): string => {
  return `${resourceName}.${action.toString()}.${grant.toString()}`;
};
