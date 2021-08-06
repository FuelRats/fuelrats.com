
/**
* Module override for koa-compose. @types/koa-compose is koa-specific, while we are using this tool in a generic context.
*/
declare module "koa-compose" {
  declare function NextFunc(): Promise<void>;

  declare namespace compose {
    type Middleware<C> = (context: C, next: NextFunc) => Promise<any>;
    type ComposedMiddleware<C> = (context: C, next?: NextFunc) => Promise<void>;
  }

  export default function compose<C>(middleware: Array<compose.Middleware<C>>): compose.ComposedMiddleware<C>;
}
