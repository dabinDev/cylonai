const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '175.178.189.234',
  port: 22,
  username: 'root',
  password: 'cylonai@2026',
};

function runCommand(conn, cmd, opts = {}) {
  return new Promise((resolve) => {
    console.log(`\n>>> ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) { console.error('Exec error:', err); resolve({ stdout: '', stderr: err.message, code: 1 }); return; }
      let stdout = '';
      let stderr = '';
      stream.on('data', (data) => { stdout += data.toString(); process.stdout.write(data.toString()); });
      stream.stderr.on('data', (data) => { stderr += data.toString(); process.stderr.write(data.toString()); });
      stream.on('close', (code) => {
        if (code !== 0) console.log(`[exit ${code}]`);
        resolve({ stdout, stderr, code });
      });
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH connected to CentOS 7!\n');

  try {
    // Step 1: Install basic tools
    console.log('=== Step 1: Install basic tools ===');
    await runCommand(conn, 'yum install -y git curl wget');

    // Step 2: Install Docker
    console.log('\n=== Step 2: Install Docker ===');
    const dockerCheck = await runCommand(conn, 'docker --version 2>/dev/null || echo "not installed"');
    if (dockerCheck.stdout.trim().includes('not installed')) {
      await runCommand(conn, 'yum install -y yum-utils device-mapper-persistent-data lvm2');
      await runCommand(conn, 'yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo');
      await runCommand(conn, 'yum install -y docker-ce docker-ce-cli containerd.io');
      await runCommand(conn, 'systemctl start docker');
      await runCommand(conn, 'systemctl enable docker');
    }
    await runCommand(conn, 'docker --version');

    // Step 3: Clone/update project
    console.log('\n=== Step 3: Clone project ===');
    await runCommand(conn, 'mkdir -p /var/www');
    const gitCheck = await runCommand(conn, 'test -d /var/www/cylonai/.git && echo "exists" || echo "new"');
    if (gitCheck.stdout.trim() === 'new') {
      await runCommand(conn, 'rm -rf /var/www/cylonai');
      await runCommand(conn, 'cd /var/www && git clone https://github.com/dabinDev/cylonai.git');
    } else {
      await runCommand(conn, 'cd /var/www/cylonai && git pull origin main');
    }

    // Step 4: Update Prisma schema from SQLite to MySQL
    console.log('\n=== Step 4: Update Prisma schema for MySQL ===');
    await runCommand(conn, `cd /var/www/cylonai && sed -i 's/provider = "sqlite"/provider = "mysql"/' prisma/schema.prisma`);
    await runCommand(conn, `cd /var/www/cylonai && sed -i '/url.*env.*DATABASE_URL/d' prisma/schema.prisma`);

    // Step 5: Create .env for production
    console.log('\n=== Step 5: Create .env ===');
    await runCommand(conn, `cat > /var/www/cylonai/.env << 'ENVEOF'
DATABASE_URL="mysql://cylonai:CylonAI2026@db:3306/cylonai"
JWT_SECRET="cylon-ai-prod-jwt-secret-x7k9m2p4q8r1t6v3w"
NODE_ENV="production"
ENVEOF`);

    // Step 6: Create Dockerfile
    console.log('\n=== Step 6: Create Dockerfile ===');
    await runCommand(conn, `cat > /var/www/cylonai/Dockerfile << 'DEOF'
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./

RUN npm install --ignore-scripts

# Remove sqlite-only deps
RUN rm -rf node_modules/better-sqlite3 node_modules/@prisma/adapter-better-sqlite3

COPY . .

# Switch schema to mysql and add @db.Text for long content fields
RUN sed -i 's/provider = "sqlite"/provider = "mysql"/' prisma/schema.prisma
RUN sed -i 's/^  content        String$/  content        String   @db.Text/' prisma/schema.prisma
RUN sed -i 's/^  excerpt        String?$/  excerpt        String?  @db.Text/' prisma/schema.prisma

RUN npx prisma generate

RUN DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy" npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm start"]
DEOF`);

    // Step 7: Create .dockerignore
    console.log('\n=== Step 7: Create .dockerignore ===');
    await runCommand(conn, `cat > /var/www/cylonai/.dockerignore << 'DIEOF'
node_modules
.next
dev.db
.git
DIEOF`);

    // Step 8: Create docker-compose.yml
    console.log('\n=== Step 8: Create docker-compose.yml ===');
    await runCommand(conn, `cat > /var/www/cylonai/docker-compose.yml << 'CPEOF'
version: '3.8'

services:
  db:
    image: mariadb:10.5
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: CylonAI2026
      MYSQL_DATABASE: cylonai
      MYSQL_USER: cylonai
      MYSQL_PASSWORD: CylonAI2026
    volumes:
      - db_data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "mysql://cylonai:CylonAI2026@db:3306/cylonai"
      JWT_SECRET: "cylon-ai-prod-jwt-secret-x7k9m2p4q8r1t6v3w"
      NODE_ENV: "production"
    depends_on:
      - db

volumes:
  db_data:
CPEOF`);

    // Step 9: Build and start with Docker Compose
    console.log('\n=== Step 9: Build and start containers ===');
    // Install docker-compose if not available
    const composeCheck = await runCommand(conn, 'docker compose version 2>/dev/null || docker-compose --version 2>/dev/null || echo "not installed"');
    if (composeCheck.stdout.trim().includes('not installed')) {
      await runCommand(conn, 'curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose');
      await runCommand(conn, 'chmod +x /usr/local/bin/docker-compose');
    }

    // Stop old containers
    await runCommand(conn, 'cd /var/www/cylonai && docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true');

    // Build and start
    await runCommand(conn, 'cd /var/www/cylonai && docker compose up -d --build', { timeout: 600 });

    // Step 10: Wait and check status
    console.log('\n=== Step 10: Check container status ===');
    await runCommand(conn, 'sleep 20 && docker ps');
    await runCommand(conn, 'docker logs cylonai-app-1 --tail 30 2>/dev/null || docker logs cylonai_app_1 --tail 30 2>/dev/null || echo "Checking all logs..." && cd /var/www/cylonai && docker compose logs --tail 30');

    // Step 11: Open firewall port
    console.log('\n=== Step 11: Firewall ===');
    await runCommand(conn, 'firewall-cmd --zone=public --add-port=3000/tcp --permanent 2>/dev/null || true');
    await runCommand(conn, 'firewall-cmd --reload 2>/dev/null || true');

    console.log('\n========================================');
    console.log('Deployment complete!');
    console.log('URL: http://175.178.189.234:3000');
    console.log('Admin: http://175.178.189.234:3000/admin/login');
    console.log('Username: admin / Password: 123456');
    console.log('========================================');

  } catch (err) {
    console.error('Deployment error:', err);
  }

  conn.end();
});

conn.on('error', (err) => {
  console.error('SSH Error:', err.message);
});

console.log('Connecting to 175.178.189.234 (CentOS 7)...');
conn.connect(config);
