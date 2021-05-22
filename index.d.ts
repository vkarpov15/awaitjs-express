import type { Application, Express, Router, RouterOptions } from 'express'
import type { Request, Response, ParamsDictionary, NextFunction, PathParams} from 'express-serve-static-core'
import type { ParsedQs } from 'qs'

export type AsyncRequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs> =
  (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<any>

export type AsyncErrorRequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs> =
    (err: any, req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<any>

export type AsyncRequestHandlerParams<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>
    = AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>
    | AsyncErrorRequestHandler<P, ResBody, ReqBody, ReqQuery>
    | Array<AsyncRequestHandler<P> | AsyncErrorRequestHandler<P>>

export interface AsyncIRouterHandler<T> {
  (...handlers: AsyncRequestHandler[]): T
  (...handlers: AsyncRequestHandlerParams[]): T
  <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(...handlers: Array<AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>>): T
  <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(...handlers: Array<AsyncRequestHandlerParams<P, ResBody, ReqBody, ReqQuery>>): T
}

export interface AsyncIRouterMatcher<T> {
  <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(path: PathParams, handler: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>): T
  <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(path: PathParams, handler: AsyncRequestHandlerParams<P, ResBody, ReqBody, ReqQuery>): T
  (path: PathParams, subApplication: Application): T
}

export interface IRouterWithAsync {
  deleteAsync: AsyncIRouterMatcher<this>
  getAsync: AsyncIRouterMatcher<this>
  headAsync: AsyncIRouterMatcher<this>
  paramAsync: AsyncIRouterMatcher<this>
  patchAsync: AsyncIRouterMatcher<this>
  postAsync: AsyncIRouterMatcher<this>
  putAsync: AsyncIRouterMatcher<this>

  useAsync: AsyncIRouterHandler<this> & AsyncIRouterMatcher<this>
}

export type ExpressWithAsync = Express & IRouterWithAsync
export type RouterWithAsync = Router & IRouterWithAsync

declare function addAsync(app: Express): ExpressWithAsync
declare function addAsync(app: Router): RouterWithAsync

export const decorateRouter: (router: Router) => RouterWithAsync
export const decorateApp: (router: Express) => ExpressWithAsync

declare function AsyncRouter(options?: RouterOptions): RouterWithAsync
declare function wrap(fn: Function, isParam: boolean): Function

export { addAsync, wrap, AsyncRouter as Router }
