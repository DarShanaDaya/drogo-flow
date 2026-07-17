import { describe, it, expect, vi } from 'vitest';
import { cn, generateId, formatDate, copyToClipboard } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('a', 'b')).toBe('a b');
    });

    it('handles conditional classes', () => {
      expect(cn('a', false && 'b', 'c')).toBe('a c');
    });

    it('merges tailwind classes', () => {
      // tailwind-merge should handle conflicting classes
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toContain('px-4');
      expect(result).not.toContain('px-2');
    });
  });

  describe('generateId', () => {
    it('generates unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('formatDate', () => {
    it('formats date string', () => {
      const date = '2024-01-15T10:00:00.000Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('copyToClipboard', () => {
    it('copies text to clipboard', async () => {
      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('handles clipboard error', async () => {
      // @ts-ignore
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Failed'));
      const result = await copyToClipboard('test');
      expect(result).toBe(false);
      
      // Restore
      // @ts-ignore
      navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
    });
  });
});
