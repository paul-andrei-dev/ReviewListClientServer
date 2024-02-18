import { parseTemplate } from 'url-template';

const _endpoints = {
  task: parseTemplate('/reviews/{timestamp}'),
};
export const REVIEW_CONSTS = {
  endpoints: _endpoints,
};
