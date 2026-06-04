Deployment guide — Laravel backend + Vercel frontend

This document shows step-by-step instructions to deploy the Laravel `backend/` and connect the React/Vite frontend hosted on Vercel.

Recommended host (matches your DB): Alwaysdata
Alternative hosts: Render, DigitalOcean App Platform, Railway, Hetzner, Forge + VPS, Laravel Vapor (serverless)

1) Prepare the repo
- Ensure `backend/` contains `composer.json`, `.env.example` and `public/`.
- Commit any production-ready changes and push to GitHub.

2) Server setup (Alwaysdata example)
- Create an account on Alwaysdata and create a new web application with PHP >= 8.0 and the proper PHP extensions (pdo_mysql, mbstring, openssl, tokenizer, xml, ctype, json, fileinfo).
- Add a new site and set the document root to the `public/` folder of your project.

3) Deploy code to server
- Use git or SFTP to upload the `backend/` directory to the server. If alwaysdata provides a git remote, add it and push:

```bash
# from your local repo root
cd backend
# if Alwaysdata provides a remote named 'always'
git remote add always ssh://<user>@git.alwaysdata.com/~/repository.git
git push always main
```

- Or archive and upload via SFTP, then extract on the server.

4) Server post-deploy steps (run on the server or via SSH)

```bash
cd /path/to/backend
# install deps
composer install --no-dev --optimize-autoloader
# generate app key
php artisan key:generate --force
# set permissions (example)
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
# migrate database
php artisan migrate --force
# optional seed
php artisan db:seed --force
# create symlink for public storage
php artisan storage:link
# optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

5) Configure environment variables
- On the server, create `/path/to/backend/.env` with production values.
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_URL=https://api.your-domain.tld` (your backend public URL)
  - DB_* values pointing to your MySQL server
  - `SANCTUM_STATEFUL_DOMAINS` should include your frontend domain when using first-party cookie auth, e.g. `vita-bi.vercel.app`.

Example important entries:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.vita-bi.example
DB_CONNECTION=mysql
DB_HOST=mysql-boushera-bai.alwaysdata.net
DB_PORT=3306
DB_DATABASE=boushera-bai_vitabi
DB_USERNAME=boushera-bai
DB_PASSWORD=<your-db-password>
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,vita-bi.vercel.app
```

6) HTTPS / TLS
- Request or install an SSL certificate for `api.your-domain.tld`.
- Always use HTTPS for the API; browsers block mixed content.

7) CORS and Sanctum
- If you use Bearer tokens (your frontend sends `Authorization: Bearer <token>`), CORS can remain permissive but `supports_credentials` can be `false`.
- If you plan to use Sanctum cookie-based SPA auth, set `supports_credentials` => true in `config/cors.php` and add the frontend domain to `SANCTUM_STATEFUL_DOMAINS`.

8) Test the API (from your machine)
- Replace `api.your-domain.tld` with your real backend URL.

```
# public test
curl -i https://api.your-domain.tld/api/test

# register
curl -i -X POST https://api.your-domain.tld/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password","password_confirmation":"password"}'

# login
curl -i -X POST https://api.your-domain.tld/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

9) Configure Vercel (frontend)
- In your Vercel project settings > Environment Variables add:
  - `VITE_API_URL` with value `https://api.your-domain.tld`
  - Set for `Production` (and `Preview` if needed)
- Re-deploy the Vercel project or trigger a new push to GitHub.

10) Verify end-to-end
- Open `https://<your-vercel-site>` and attempt login/register.
- Use the browser devtools network tab to ensure requests go to `https://api.your-domain.tld` and return `200/201` or proper errors.

11) Additional production tips
- Use queue workers for long-running tasks and a process manager (supervisor) for workers.
- Set up backups for the database.
- Configure monitoring and alerting (Laravel Horizon, Sentry, etc.).

Troubleshooting
- If `Failed to fetch` in the browser: check that `https://api.your-domain.tld/api/test` is reachable from your machine; check CORS; check network / firewall settings.
- If 401 on `/api/login`: verify DB credentials and that users exist. Check `php artisan tinker` to query users.

If you want, I can:
- prepare a `deploy_backend.sh` script for the server (SSH) to run the common post-deploy steps
- create a `README` with the exact `APP_URL` placeholder updated for your domain
- help you set the `VITE_API_URL` value in Vercel (I can't set it myself but I can give the exact values and UI steps)

---

If you confirm which host you want (Alwaysdata, Render, DigitalOcean, Railway, or other), I can generate server-ready commands and a `deploy_backend.sh` script tailored to that host.