import { Express, Router, IRouter, RouterOptions, RequestHandler } from 'express';

type PathParams = string | RegExp | Array<string | RegExp>;
type AsyncRequestHandler = ((path: PathParams, fn: (...args: Parameters<RequestHandler>) => Promise<void>) => void);

export interface IRouterWithAsync {
  useAsync: IRouter['use'] | AsyncRequestHandler;
  deleteAsync: IRouter['delete'] | AsyncRequestHandler;
  getAsync: IRouter['get'] | AsyncRequestHandler;
  headAsync: IRouter['head'] | AsyncRequestHandler;
  paramAsync: IRouter['param'] | AsyncRequestHandler;
  patchAsync: IRouter['patch'] | AsyncRequestHandler;
  postAsync: IRouter['post'] | AsyncRequestHandler;
  putAsync: IRouter['put'] | AsyncRequestHandler;
}

export interface ExpressWithAsync extends Express, IRouterWithAsync { }
export interface RouterWithAsync extends Router, IRouterWithAsync { }

declare function addAsync(app: Express): ExpressWithAsync;
declare function addAsync(app: Router): RouterWithAsync;
export { addAsync };

export const decorateRouter: (router: Router) => RouterWithAsync;
export const decorateApp: (router: Express) => ExpressWithAsync;

declare function AsyncRouter(options?: RouterOptions): RouterWithAsync;
export { AsyncRouter as Router };

declare function wrap(fn: ((...args: Parameters<RequestHandler>) => Promise<void>) | Function, isParam?: boolean): Function;
export { wrap };
