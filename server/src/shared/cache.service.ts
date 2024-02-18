import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService<T> {
  private cache: Record<string, T> = {};
  private timeouts: Record<string, NodeJS.Timeout> = {};

  set(key: string, value: T, ttl?: number): void {
    this.cache[key] = value;
    if (ttl) {
      if (this.timeouts[key]) {
        clearTimeout(this.timeouts[key]);
      }
      this.timeouts[key] = setTimeout(() => {
        delete this.cache[key];
      }, ttl);
    }
  }

  get(key: string): T | undefined {
    return this.cache[key];
  }

  invalidate(key: string): void {
    if (this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
      delete this.timeouts[key];
    }
    delete this.cache[key];
  }
}
