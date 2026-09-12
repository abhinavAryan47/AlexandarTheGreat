import { JsonRepository } from './json.repository';
import { Notice } from '../models/notice.model';

export class NoticeRepository extends JsonRepository<Notice> {
  constructor(customDir?: string) {
    super('notices.json', customDir);
  }

  async findByCategory(category: string): Promise<Notice[]> {
    return this.find(
      (n) => n.category?.toLowerCase() === category.toLowerCase()
    );
  }
}

export const noticeRepository = new NoticeRepository();
