import { Express, Router, IRouter } from 'express'

export interface IRouterWithAsync {
  useAsync: IRouter['use']
  deleteAsync: IRouter['delete']
  getAsync: IRouter['get']
  patchAsync: IRouter['patch']
  postAsync: IRouter['post']
  putAsync: IRouter['put']
  headAsync: IRouter['head']
}

export interface ExpressWithAsync extends Express, IRouterWithAsync { }
export interface RouterWithAsync extends Router, IRouterWithAsync { }

declare function addAsync(app: Express): ExpressWithAsync
declare function addAsync(app: Router): RouterWithAsync
export { addAsync }

export const decorateRouter: (router: Router) => RouterWithAsync
export const decorateApp: (router: Express) => ExpressWithAsync
