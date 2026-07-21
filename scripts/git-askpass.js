const prompt = (process.argv[2] || '').toLowerCase();

if (prompt.includes('username')) {
  process.stdout.write(process.env.GIT_ASKPASS_USERNAME || '');
} else {
  process.stdout.write(process.env.GIT_ASKPASS_PASSWORD || '');
}
