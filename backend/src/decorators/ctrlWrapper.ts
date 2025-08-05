import type { Request, Response, NextFunction } from "express";

export type CtrlFunction<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

const ctrlWrapper = <T>(ctrl: CtrlFunction<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default ctrlWrapper;
