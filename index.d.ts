import { Express, Router, RouterOptions } from 'express'
import type { Request, Response, ParamsDictionary, NextFunction, IRouter as _IRouter } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

// copied from express-serve-static-core so we can change the function signature
export interface RequestHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    Locals extends Record<string, any> = Record<string, any>
> {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2)
    (
        req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
        res: Response<ResBody, Locals>,
        next: NextFunction,
    ): Promise<void>;
}

interface IRouter extends RequestHandler, _IRouter {
}

export interface IRouterWithAsync {
  useAsync: IRouter['use']
  deleteAsync: IRouter['delete']
  getAsync: IRouter['get']
  headAsync: IRouter['head']
  paramAsync: IRouter['param']
  patchAsync: IRouter['patch']
  postAsync: IRouter['post']
  putAsync: IRouter['put']
}

export interface ExpressWithAsync extends Express, IRouterWithAsync { }
export interface RouterWithAsync extends Router, IRouterWithAsync { }

declare function addAsync(app: Express): ExpressWithAsync
declare function addAsync(app: Router): RouterWithAsync
export { addAsync }

export const decorateRouter: (router: Router) => RouterWithAsync
export const decorateApp: (router: Express) => ExpressWithAsync

declare function AsyncRouter(options?: RouterOptions): RouterWithAsync
export { AsyncRouter as Router }

declare function wrap(fn: Function, isParam: boolean): Function
export { wrap }
