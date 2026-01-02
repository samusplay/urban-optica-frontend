import { UrlS3Pipe } from './url-s3-pipe';

describe('UrlS3Pipe', () => {
  it('create an instance', () => {
    const pipe = new UrlS3Pipe();
    expect(pipe).toBeTruthy();
  });
});
