// utilities
import { Actions } from "../actions";
import { Permission, GrantSet, GrantType } from "./../permission";

export * from "./interfaces";

/**
 * parsePermissionsList()
 *
 * parses a permission lit.
 * @param scopeStringlist the scope list
 * @returns the created permissions list
 * @throws an error if the scope list is invalid
 */

export const parsePermissionsList = (
  scopeStringlist: string[],
): Permission[] => {
  const permissions: Permission[] = [];
  const permissionsMap = generatePermissionsMap(scopeStringlist);
  permissionsMap.forEach((grantSet, resource) => {
    permissions.push(
      new Permission(
        resource,
        new GrantSet(
          grantSet.create || "none",
          grantSet.read || "none",
          grantSet.update || "none",
          grantSet.delete || "none",
        ),
      ),
    );
  });
  return permissions;
};

/**
 * generatePermissionsMap()
 *
 * generate permissions map from a list of scopes
 * @param scopeStringList the scope list to map
 * @returns the generated permissions map
 * @throws an error if any of the scopes in the scope list are invalid.
 */

const generatePermissionsMap = (
  scopeStringList: string[],
): Map<string, Partial<GrantSet>> => {
  const permissionsMap = new Map<string, Partial<GrantSet>>();
  const validActions = [
    Actions.Create.toString(),
    Actions.Delete.toString(),
    Actions.Update.toString(),
    Actions.Read.toString(),
  ];
  const validGrantTypes = ["any", "none", "own"];

  let segments: string[] = [];
  let record: Partial<GrantSet>;
  let scopeResource: string;
  let scopeAction: string;
  let scopeGrantType: string;
  scopeStringList.forEach((scope) => {
    segments = scope.split(".");

    if (segments.length === 3) {
      scopeResource = segments[0];
      scopeAction = segments[1];
      scopeGrantType = segments[2];

      if (
        validActions.includes(scopeAction) &&
        validGrantTypes.includes(scopeGrantType)
      ) {
        const action = createActionFromString(scopeAction);
        const grantType: GrantType = scopeGrantType as GrantType;

        if (permissionsMap.has(scopeResource)) {
          // update the record
          record = permissionsMap.get(scopeResource)!;
          record = {
            create: action === Actions.Create ? grantType : record.create,
            read: action === Actions.Read ? grantType : record.read,
            update: action === Actions.Update ? grantType : record.update,
            delete: action === Actions.Delete ? grantType : record.delete,
          };
        } else {
          // create a new record
          record = {
            create: action === Actions.Create ? grantType : undefined,
            read: action === Actions.Read ? grantType : undefined,
            update: action === Actions.Update ? grantType : undefined,
            delete: action === Actions.Delete ? grantType : undefined,
          };
        }
        permissionsMap.set(scopeResource, record);
      } else {
        throw new Error("Invalid scope: " + scope);
      }
    } else {
      // invalid scope
      throw new Error("Invalid scope: " + scope);
    }
  });

  return permissionsMap;
};

/**
 * createActionFromString()
 *
 * creates an action from a string.
 * @param str the string to convert.
 * @returns the converted action
 * @throws an error if the action is invalid.
 */
const createActionFromString = (str: string): Actions => {
  switch (str) {
    case Actions.Create.toString():
      return Actions.Create;
      break;
    case Actions.Read.toString():
      return Actions.Read;
      break;
    case Actions.Update.toString():
      return Actions.Update;
      break;
    case Actions.Delete.toString():
      return Actions.Delete;
      break;
    default:
      throw new Error("Invalid action: " + str);
  }
};
