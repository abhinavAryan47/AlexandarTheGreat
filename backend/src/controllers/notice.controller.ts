import { Request, Response, NextFunction } from 'express';
import { NoticeService, noticeService } from '../services/notice.service';
import { ApiResponse } from '../utils/api-response';

export class NoticeController {
  constructor(private service: NoticeService = noticeService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notices = await this.service.getAllNotices();
      ApiResponse.success(res, notices);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notice = await this.service.getNoticeById(req.params.id);
      if (!notice) {
        ApiResponse.error(res, 'NOTICE_NOT_FOUND', `Notice with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, notice);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notice = await this.service.createNotice(req.body);
      ApiResponse.success(res, notice, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notice = await this.service.updateNotice(req.params.id, req.body);
      if (!notice) {
        ApiResponse.error(res, 'NOTICE_NOT_FOUND', `Notice with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, notice);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.deleteNotice(req.params.id);
      if (!deleted) {
        ApiResponse.error(res, 'NOTICE_NOT_FOUND', `Notice with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, { message: `Notice ${req.params.id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export const noticeController = new NoticeController();
