import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/env';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class JsonRepository<T extends BaseEntity> {
  protected readonly filePath: string;
  protected readonly dirPath: string;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(fileName: string, customDir?: string) {
    this.dirPath = customDir || ENV.DATA_DIR;
    this.filePath = path.join(this.dirPath, fileName);
  }

  /**
   * Ensures the storage directory and JSON file exist.
   */
  private async ensureInitialized(): Promise<void> {
    try {
      await fs.mkdir(this.dirPath, { recursive: true });
      try {
        await fs.access(this.filePath);
      } catch {
        await fs.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (error) {
      console.error(`Failed to initialize storage at ${this.filePath}:`, error);
      throw error;
    }
  }

  /**
   * Safely reads all records from the JSON file.
   */
  private async readAll(): Promise<T[]> {
    await this.ensureInitialized();
    try {
      const rawData = await fs.readFile(this.filePath, 'utf-8');
      if (!rawData || rawData.trim() === '') {
        return [];
      }
      return JSON.parse(rawData) as T[];
    } catch (error) {
      console.error(`Error reading data from ${this.filePath}:`, error);
      // Return empty array if file is corrupted or empty
      return [];
    }
  }

  /**
   * Safely writes records to the JSON file with write serialization.
   */
  private async writeAll(data: T[]): Promise<void> {
    await this.ensureInitialized();
    
    // Chain onto the write queue to serialize file writes and prevent concurrency collisions
    this.writeQueue = this.writeQueue.then(async () => {
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      try {
        const content = JSON.stringify(data, null, 2);
        await fs.writeFile(tempPath, content, 'utf-8');
        await fs.rename(tempPath, this.filePath);
      } catch (error) {
        try {
          await fs.unlink(tempPath);
        } catch {
          // Ignore temp file cleanup error
        }
        throw error;
      }
    });

    return this.writeQueue;
  }

  /**
   * Retrieves all items from storage.
   */
  async getAll(): Promise<T[]> {
    return this.readAll();
  }

  /**
   * Retrieves a single item by its unique ID.
   */
  async getById(id: string): Promise<T | null> {
    const items = await this.readAll();
    const item = items.find((i) => i.id === id);
    return item || null;
  }

  /**
   * Creates and stores a new entity with auto-generated ID and timestamps.
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseEntity>): Promise<T> {
    const items = await this.readAll();
    const now = new Date().toISOString();

    const newEntity = {
      ...data,
      id: data.id || uuidv4(),
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now
    } as unknown as T;

    items.push(newEntity);
    await this.writeAll(items);
    return newEntity;
  }

  /**
   * Updates an existing entity by ID.
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    const items = await this.readAll();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      return null;
    }

    const existing = items[index];
    const updatedEntity: T = {
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedEntity;
    await this.writeAll(items);
    return updatedEntity;
  }

  /**
   * Deletes an entity by ID.
   */
  async delete(id: string): Promise<boolean> {
    const items = await this.readAll();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    await this.writeAll(items);
    return true;
  }

  /**
   * Finds entities matching a predicate function.
   */
  async find(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.readAll();
    return items.filter(predicate);
  }

  /**
   * Clears all items (useful for testing and re-seeding).
   */
  async clear(): Promise<void> {
    await this.writeAll([]);
  }
}
