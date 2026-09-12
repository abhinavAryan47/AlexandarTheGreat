import { Notice } from '../models/notice.model';
import { CreateNoticeInput, UpdateNoticeInput } from '../schemas/notice.schema';
import { NoticeRepository, noticeRepository } from '../repositories/notice.repository';

export class NoticeService {
  constructor(private repo: NoticeRepository = noticeRepository) {}

  async getAllNotices(): Promise<Notice[]> {
    return this.repo.getAll();
  }

  async getNoticeById(id: string): Promise<Notice | null> {
    return this.repo.getById(id);
  }

  async createNotice(input: CreateNoticeInput): Promise<Notice> {
    return this.repo.create(input);
  }

  async updateNotice(id: string, input: UpdateNoticeInput): Promise<Notice | null> {
    return this.repo.update(id, input);
  }

  async deleteNotice(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}

export const noticeService = new NoticeService();
