import { Request, Response, NextFunction } from 'express';
import { stripHtml, Res } from 'string-strip-html';

function recursivelyStripHtml<T, K extends keyof T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map(item => recursivelyStripHtml(item)) as T;
  }
  if (typeof data === 'object' && data !== null) {
    const result: T = { ...data };

    Object.keys(data).forEach(key => {
      result[key as K] = recursivelyStripHtml(data[key as K]);
    });
    return result as T;
  }
  if (typeof data === 'string') {
    const stripped: Res = stripHtml(data);
    return stripped.result.trim() as T;
  }
  return data as T;
}

export function stringStripHtml(req: Request, res: Response, next: NextFunction) {
  req.body = recursivelyStripHtml(req.body);
  req.query = recursivelyStripHtml(req.query);
  req.params = recursivelyStripHtml(req.params);
  next();
}
