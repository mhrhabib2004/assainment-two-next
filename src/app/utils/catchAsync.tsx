import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err) => {
            res.status(500).json({ message: err.message || 'Internal Server Error' });
        });
    };
};

export default catchAsync;
