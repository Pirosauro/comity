import type { Mock } from 'vitest';
import type { Context } from 'hono';
import type { Options } from '../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { envelop } from '@envelop/core';
import { graphqlHandler } from '../graphql-handler';
import { getGraphQLParams } from '../get-graphql-params.js';

vi.mock('@envelop/core', () => ({
  envelop: vi.fn(),
}));

vi.mock('../get-graphql-params.js', () => ({
  getGraphQLParams: vi.fn(),
}));

describe('graphqlHandler', () => {
  it('should return next if method is not GET or POST', async () => {
    const handler = graphqlHandler({ plugins: [] });
    const next = vi.fn();
    const c = {
      req: { method: 'PUT' },
    };

    // @ts-expect-error
    await handler(c, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return validation errors if document is invalid', async () => {
    (envelop as Mock).mockReturnValue(() => ({
      parse: vi.fn().mockReturnValue({}),
      validate: vi.fn().mockReturnValue([{ message: 'Error' }]),
      contextFactory: vi.fn(),
      execute: vi.fn(),
      schema: {},
    }));

    const handler = graphqlHandler({ plugins: [] });
    const next = vi.fn();
    const c = {
      req: { method: 'POST', raw: {} },
      json: vi.fn(),
    };

    (getGraphQLParams as Mock).mockResolvedValue({
      query: '',
      variables: {},
      operationName: '',
    });

    // @ts-expect-error
    await handler(c, next);

    expect(c.json).toHaveBeenCalledWith({
      data: null,
      errors: [{ message: 'Error' }],
    });
  });

  it('should execute query and return result', async () => {
    (envelop as Mock).mockReturnValue(() => ({
      parse: vi.fn().mockReturnValue({}),
      validate: vi.fn().mockReturnValue([]),
      contextFactory: vi.fn().mockResolvedValue({}),
      execute: vi.fn().mockResolvedValue({ data: 'result' }),
      schema: {},
    }));

    const handler = graphqlHandler({ plugins: [] });
    const next = vi.fn();
    const c = {
      req: { method: 'POST', raw: {} },
      json: vi.fn(),
    };

    (getGraphQLParams as Mock).mockResolvedValue({
      query: '',
      variables: {},
      operationName: '',
    });

    // @ts-expect-error
    await handler(c, next);

    expect(c.json).toHaveBeenCalledWith({ data: 'result' });
  });
});
