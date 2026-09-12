import { Request, Response, NextFunction } from 'express';
import { NoticeService, noticeService } from '../services/notice.service';
import { NoticeAnalyzerService, noticeAnalyzerService } from '../ai/notice-analyzer.service';
import { ApiResponse } from '../utils/api-response';

export class NoticeController {
  constructor(
    private service: NoticeService = noticeService,
    private analyzer: NoticeAnalyzerService = noticeAnalyzerService
  ) {}

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

  analyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { content, studentId } = req.body;
      const result = await this.analyzer.analyzeNotice(content, studentId);
      ApiResponse.success(res, result, 201);
    } catch (error: any) {
      if (error.message && error.message.includes('NVIDIA NIM')) {
        ApiResponse.error(res, 'NIM_API_ERROR', error.message, 503);
        return;
      }
      next(error);
    }
  };
}

export const noticeController = new NoticeController();
