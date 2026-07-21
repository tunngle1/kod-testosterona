const { execSync } = require('child_process');
const https = require('https');

const REPO_NAME = 'kod-testosterona';
const REPO_DESC = 'Лендинг вебинара «Код тестостерона»';

function getCredentials() {
  const output = execSync('git credential fill', {
    input: 'protocol=https\nhost=github.com\n\n',
  }).toString();

  const creds = {};
  for (const line of output.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) creds[key] = rest.join('=');
  }

  if (!creds.username || !creds.password) {
    throw new Error('GitHub credentials not found. Run gh auth login or sign in via Git.');
  }

  return creds;
}

function githubRequest({ method, path, token, body }) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.github.com',
        path,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'kod-testosterona-publish',
          ...(payload
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
              }
            : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function ensureRepo(username, token) {
  const create = await githubRequest({
    method: 'POST',
    path: '/user/repos',
    token,
    body: {
      name: REPO_NAME,
      description: REPO_DESC,
      private: false,
      has_issues: true,
    },
  });

  if (create.status === 201) {
    console.log(`Created repository: https://github.com/${username}/${REPO_NAME}`);
    return;
  }

  if (create.status === 422 && create.data?.errors?.some((e) => e.message?.includes('already exists'))) {
    console.log(`Repository already exists: https://github.com/${username}/${REPO_NAME}`);
    return;
  }

  throw new Error(`Failed to create repository: ${create.status} ${JSON.stringify(create.data)}`);
}

function runGit(args, cwd) {
  execSync(`git ${args}`, { cwd, stdio: 'inherit' });
}

async function main() {
  const projectRoot = require('path').resolve(__dirname, '..');
  const { username, password: token } = getCredentials();

  process.chdir(projectRoot);

  if (!require('fs').existsSync('.git')) {
    runGit('init -b main', projectRoot);
  }

  runGit('add .', projectRoot);

  try {
    runGit('diff --cached --quiet', projectRoot);
    console.log('Nothing new to commit.');
  } catch {
    runGit(
      'commit -m "Initial commit: landing page for Kod Testosterona webinar"',
      projectRoot
    );
  }

  await ensureRepo(username, token);

  const remoteUrl = `https://github.com/${username}/${REPO_NAME}.git`;
  try {
    runGit(`remote remove origin`, projectRoot);
  } catch {}

  runGit(`remote add origin ${remoteUrl}`, projectRoot);

  const askpass = require('path').join(__dirname, 'git-askpass.js');
  execSync('git push -u origin main', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      GIT_ASKPASS: process.execPath,
      GIT_ASKPASS_USERNAME: username,
      GIT_ASKPASS_PASSWORD: token,
    },
  });

  console.log(`\nDone: https://github.com/${username}/${REPO_NAME}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
