import { Express, IRouter } from 'express'

interface ExpressWithAsync extends Express {
  useAsync: IRouter['use']
  deleteAsync: IRouter['delete']
  getAsync: IRouter['get']
  patchAsync: IRouter['patch']
  postAsync: IRouter['post']
  putAsync: IRouter['put']
  headAsync: IRouter['head']
}

export const addAsync: (app: Express) => ExpressWithAsync
