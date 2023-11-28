import { Request, Response, NextFunction } from 'express';
import { stripHtml } from 'string-strip-html';

export function stringStripHtml(req: Request, res: Response, next: NextFunction) {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = stripHtml(req.body[key]).result;
      req.body[key] = req.body[key].trim();
    }
  });

  Object.keys(req.query).forEach((key) => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = stripHtml(req.query[key] as string).result;
      req.query[key] = (req.query[key] as string).trim();
    }
  });

  Object.keys(req.params).forEach((key) => {
    if (typeof req.params[key] === 'string') {
      req.params[key] = stripHtml(req.params[key] as string).result;
      req.params[key] = (req.params[key] as string).trim();
    }
  });

  next();
}
