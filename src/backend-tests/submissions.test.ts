import { describe, it, expect, vi } from 'vitest';
import handler from '../../backend/api/submissions/index';
import { supabaseAdmin } from '../../backend/supabaseClient';

vi.mock('../../backend/supabaseClient', () => ({
  supabase: {
    auth: { getUser: vi.fn() }
  },
  supabaseAdmin: {
    from: vi.fn((table) => {
      if (table === 'challenges') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { points: 50 },
                error: null
              })
            }))
          }))
        };
      }
      if (table === 'submissions') {
        return {
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { id: 'sub-1', score: 50, status: 'accepted' },
                error: null
              })
            }))
          }))
        };
      }
      if (table === 'leaderboard') {
        return {
          upsert: vi.fn().mockReturnValue({ error: null })
        };
      }
      return {};
    })
  }
}));

vi.mock('../../backend/authMiddleware', () => ({
  authMiddleware: vi.fn((req, res, next) => {
    req.user = { id: 'user-123' };
    return next();
  })
}));

describe('Submissions API - POST', () => {
  it('should submit a solution successfully', async () => {
    const req = {
      method: 'POST',
      body: {
        challenge_id: '550e8400-e29b-41d4-a716-446655440000',
        solution: 'console.log("hello world");'
      }
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: expect.objectContaining({ status: 'accepted', score: 50 })
    }));
  });
});
