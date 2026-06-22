interface CloudflareEnv {
  DB: D1Database;
}

interface Request {
  json(): Promise<any>;
}

interface Response {
  json(): Promise<any>;
}
