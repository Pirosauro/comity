import { describe, expect, it } from 'vitest';
import { parseRequest } from '../parse-request.js';

describe('parseRequest', () => {
  it('should parse application/graphql content type', async () => {
    const request = new Request('http://example.com/graphql', {
      method: 'POST',
      body: '{ test }',
      headers: { 'Content-Type': 'application/graphql' },
    });
    const result = await parseRequest(request);

    expect(result).toEqual({ query: '{ test }' });
  });

  it('should parse application/json content type', async () => {
    const request = new Request('http://example.com/graphql', {
      method: 'POST',
      body: JSON.stringify({ test: 'value' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await parseRequest(request);

    expect(result).toEqual({ test: 'value' });
  });

  it('should throw an error for invalid JSON', async () => {
    const request = new Request('http://example.com/graphql', {
      method: 'POST',
      body: 'invalidJSON',
      headers: { 'Content-Type': 'application/json' },
    });

    await expect(parseRequest(request)).rejects.toThrow(
      'POST body sent invalid JSON'
    );
  });

  it('should parse application/x-www-form-urlencoded content type', async () => {
    const request = new Request('http://example.com/graphql', {
      method: 'POST',
      body: 'test=value&foo=bar',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const result = await parseRequest(request);

    expect(result).toEqual({ test: 'value', foo: 'bar' });
  });

  it('should return an empty object for unsupported content type', async () => {
    const request = new Request('http://example.com/graphql', {
      method: 'POST',
      body: 'test',
      headers: { 'Content-Type': 'text/plain' },
    });
    const result = await parseRequest(request);

    expect(result).toEqual({});
  });
});
