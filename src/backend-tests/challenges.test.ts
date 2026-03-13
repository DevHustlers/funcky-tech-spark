import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../../backend/api/challenges/index';
import { supabase } from '../../backend/supabaseClient';

// Mock Supabase
vi.mock('../../backend/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({
          data: [{ id: '1', title: 'Test Challenge', is_deleted: false }],
          error: null
        })
      }))
    })),
    auth: {
      getUser: vi.fn()
    }
  },
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: '1', title: 'New Challenge' },
            error: null
          })
        }))
      }))
    }))
  }
}));

// Mock Middlewares
vi.mock('../../backend/authMiddleware', () => ({
  authMiddleware: vi.fn((req, res, next) => {
    req.user = { id: 'user-123' };
    return next();
  })
}));

vi.mock('../../backend/adminMiddleware', () => ({
  adminMiddleware: vi.fn((req, res, next) => {
    return next();
  })
}));

describe('Challenges API - GET', () => {
  it('should return all challenges', async () => {
    const req = { method: 'GET' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: expect.any(Array)
    }));
  });
});

describe('Challenges API - POST', () => {
  it('should create a new challenge when admin', async () => {
    const req = {
      method: 'POST',
      body: {
        title: 'New Challenge',
        description: 'New Description that is long enough',
        difficulty: 'Medium',
        track: 'Frontend',
        points: 100
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
      data: expect.objectContaining({ title: 'New Challenge' })
    }));
  });

  it('should return 400 on validation error', async () => {
    const req = {
      method: 'POST',
      body: { title: 'Short' } // Missing fields and short title
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false
    }));
  });
});
