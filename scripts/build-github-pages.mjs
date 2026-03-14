import { existsSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const apiDir = 'src/app/api';
const tempDir = 'src/_api-disabled-for-pages';

const hasApiRoutes = existsSync(apiDir);

try {
  if (hasApiRoutes) {
    renameSync(apiDir, tempDir);
  }

  const result = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      GITHUB_PAGES: 'true'
    }
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  if (hasApiRoutes && existsSync(tempDir)) {
    renameSync(tempDir, apiDir);
  }
}
