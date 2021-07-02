// Type definitions for DefinePlugin Globals
// Project: fuelrats.com
// Definitions by: Cameron Welter <https://fuelrats.com>





declare namespace $$BUILD {
  /**
   * Exposes `NODE_ENV` state to the server.
   *
   * ```javascript
   * process.env.NODE_ENV !== 'production'
   * ```
   */
  declare const isDev: Readonly<boolean>;

  /**
   * Was CI build built from a staging branch.
   */
  declare const isStaging: Readonly<boolean>;

  /**
   * Was CI build built from a production branch.
   */
  declare const isProduction: Readonly<boolean>;

  /**
   * Branch the CI build is based on.
   *
   * `'develop'` in development.
   */
  declare const branch: Readonly<string>;

  /**
   * Full hash of the git commit used for the CI build.
   *
   * `null` in development.
   */
  declare const commit: Readonly<string>;

  /**
   * Shortened git commit hash.
   *
   * `'develop'` in development.
   */
  declare const commitShort: Readonly<string>;

  /**
   * ISO 8601 UTC timestamp representing the Date & Time of the build.
   */
  declare const date: Readonly<string>;

  /**
   * Web URL leading to build details page.
   *
   * `null` in development.
   */
  declare const url: Readonly<string>;

  /**
   * ID which represents the current build.
   *
   * The value of `$$BUILD.commit` is used in CI Builds.
   * A randomly generated 16 digit ID is used in development.
   *
   */
  declare const id: Readonly<string>;

  /**
  * NodeJS version used to build the project.
  */
  declare const nodeVersion: Readonly<string>;
}





/**
* Module override for koa-compose. @types/koa-compose is koa-specific, while we are using this tool in a generic context.
*/
declare module "koa-compose" {
  declare function NextFunc(): Promise<void>;

  declare namespace compose {
    type Middleware<C> = (context: Ctx, next: NextFunc) => Promise<any>;
    type ComposedMiddleware<C> = (context: C, next?: NextFunc) => Promise<void>;
  }

  export default function compose<C>(middleware: Array<compose.Middleware<C>>): compose.ComposedMiddleware<C>;
}
