/**
 * WhenFn
 *
 * A function to determine additional conditions for granting permission.
 */

import { Actions } from "../actions";
import { GrantType } from "../permission";
import { Resource } from "../resource";

export type WhenFn = (
  entity: {
    readonly name: string;
    readonly scope: string;
    readonly identifier: string;
  },
  action: Actions,
  resource: Resource,
) => boolean;
