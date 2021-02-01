import { Express, Router, IRouter, RouterOptions } from 'express'

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
