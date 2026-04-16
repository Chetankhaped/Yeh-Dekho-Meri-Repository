AWS integration for Deepfake Analyzer Tool

Overview
- This folder holds non-secret configuration and docs to connect the app to AWS S3.
- Provide credentials via `AWS/.env` (loaded by docker-compose) or your own secret manager for production.
 - When `S3_ENABLED=true`, the backend persists history only in S3 and returns presigned URLs; local `user_data` is not used.
 - Optional: Integrate Cognito for sign-in and enable JWT enforcement on the engine.

Required IAM Permissions (example minimal policy)
- s3:PutObject
- s3:PutObjectAcl (if using public-read)
- s3:GetObject
- s3:ListBucket (optional for listing)

Setup
- Copy `AWS/.env.example` to `AWS/.env` and fill in your values.
- Ensure your IAM credentials (or role) have access to the bucket and prefix.

Env Vars in AWS/.env
- AWS_ACCESS_KEY_ID: Access key ID for IAM user.
- AWS_SECRET_ACCESS_KEY: Secret access key for IAM user.
- AWS_SESSION_TOKEN: Optional STS session token.
- AWS_REGION: Region for the S3 bucket (e.g., us-east-1).
- S3_BUCKET_NAME: Bucket name, e.g., deepfake-analyzer-tool.
- S3_ENABLED: Toggle S3 usage (true/false). When true (default in the example), the backend uses S3-only storage and does not write to local `user_data`.
- S3_PREFIX: Prefix to namespace objects (e.g., dev, prod).

Also place Cognito variables here (used by the engine when `COGNITO_ENFORCE=true`):
- COGNITO_REGION: e.g., `us-east-1`
- COGNITO_USER_POOL_ID: your pool id
- COGNITO_USER_POOL_CLIENT_ID: your app client id

S3-only Mode Behavior
- Uploads (original media, PNGs, result.json) go directly to S3.
- History list and detail endpoints read from S3 and return presigned URLs.
- Deletions are strict: if S3 delete fails, the API request fails with HTTP 500.

Object Key Structure
- s3://<bucket>/<prefix>/user-data/<user_id>/<session_id>/
  - original uploads and generated artifacts (PNG, JSON)

Security Notes
- Never commit real secrets. Add `AWS/.env` to your global git ignore if needed.
- For production, prefer IAM roles (EC2/ECS/EKS) instead of long-lived keys.

Troubleshooting
- Verify region and bucket names are correct.
- Check clock skew on host/container if signature mismatch occurs.
- Ensure network egress to S3 is allowed.
 - Confirm IAM permissions: `s3:PutObject`, `s3:GetObject`, `s3:ListBucket`, `s3:DeleteObject`.
 - If your bucket is versioned and you need to purge versions, extend delete to remove versions via `list_object_versions`.

## Cognito (User Registration & Credentials)

Provision Cognito via the all-in-one stack `AWS/deepfake-stack.yml` (recommended). It creates:
- A Cognito User Pool (email-based sign-in)
- An App Client (no secret by default) with callback/logout URLs
- Optional Cognito Hosted UI domain (set `EnableCognitoDomain=true` and provide `DomainPrefix`)

After deployment, capture outputs for `UserPoolId`, `UserPoolClientId`, and optional `UserPoolDomain`, and map them to `AWS/.env`:
- `COGNITO_USER_POOL_ID=<output UserPoolId>`
- `COGNITO_USER_POOL_CLIENT_ID=<output UserPoolClientId>`
- `COGNITO_REGION=<your region, e.g., us-east-1>`
- (Optional) `COGNITO_DOMAIN=<output UserPoolDomain>`

Frontend login
- The static website includes an OIDC client (`oidc-client-ts`) for Authorization Code + PKCE (preferred). Provide env vars to the website container so it generates `config.json` automatically:
  - `COGNITO_AUTHORITY` (format: `https://cognito-idp.<region>.amazonaws.com/<user-pool-id>`)
  - `COGNITO_CLIENT_ID`
  - Optional: `COGNITO_LOGOUT_DOMAIN`, `OIDC_REDIRECT_PATH`

Backend enforcement
- Enable JWT verification by setting `COGNITO_ENFORCE=true` and providing `COGNITO_REGION`, `COGNITO_USER_POOL_ID`, and `COGNITO_USER_POOL_CLIENT_ID` in `AWS/.env` (ingested by the engine container).
- With enforcement enabled, the engine requires `Authorization: Bearer <id_token>` on protected routes and scopes history to the authenticated user.

See also: the root `README.md` section "Cognito login in the website (OIDC)" for end-to-end setup and usage steps.

## All-in-one CloudFormation Stack

The template `AWS/deepfake-stack.yml` provisions:
- S3 bucket (versioned, encrypted, public access blocked) with a lifecycle rule for incomplete uploads
- Cognito User Pool + App Client (with callback/logout URLs)
- Optional Hosted UI domain (`EnableCognitoDomain=true`)
- Optional IAM user with access limited to the bucket prefix (outputs include access key/secret at creation)
- API Gateway HTTP API (v2) with CORS and optional Cognito JWT authorizer
- Optional VPC + EC2 + Security Groups + IAM Instance Profile (enabled by `CreateVpcEc2=true`)
  - EC2 boots, installs Docker + Compose, clones this repo, writes `.env` and `AWS/.env`, and runs `docker compose up -d`
  - An Elastic IP is attached; the Website is exposed on port `WebsiteHostPort` (default 80)
  - API Gateway can be configured to proxy directly to the EC2 Engine (`UseInstanceAsApiOrigin=true`) or to an external origin

Recommended routing (to avoid timeouts and method limits):
- ALB listener forwards: `/` → Website, `/credits/*` → Credits, `/engine/*` → Engine
- Engine env: `BASE_PATH_PREFIX=/engine` so FastAPI strips the prefix
- Website env generates `runtime-config.json` with:
  - `engine_base_url` → API Gateway invoke URL (light ops)
  - `engine_upload_base_url` → `https://<domain>/engine` (ALB path for uploads/history)
  - `credits_base_url` → `https://<domain>/credits`
- Increase ALB idle timeout to 600 seconds for long analyses.

Deploy with custom domain (PowerShell example):
```powershell
aws cloudformation deploy `
  --stack-name deepfake-e2e `
  --template-file AWS/deepfake-stack.yml `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides `
    StackNamespace=deepfake-demo `
    S3BucketName=deepfake-analyzer-tool `
    S3Prefix=dev `
    UserPoolName=DeepfakeUsers `
    AppClientName=deepfake-web-client `
    EnableCognitoDomain=false `
    DomainPrefix=deepfake-tool-demo `
    CallbackURL=http://localhost:8080 `
    LogoutURL=http://localhost:8080 `
    EngineOriginUrl=https://your-engine.example.com `
    ApiStageName=v1 `
    ApiCorsAllowOrigins=http://localhost:8080 `
    RequireApiJwt=true `
    CreateIamUser=true `
    IamUserName=deepfake-engine-user `
    CreateVpcEc2=true `
    InstanceType=t3.large `
    WebsiteHostPort=80 `
    EngineHostPort=8001 `
    CreditsHostPort=8003 `
  UseInstanceAsApiOrigin=true `
  CreateAlb=true `
  HostedZoneId=<your-hosted-zone-id> `
  RootDomainName=pentacoresolutions.in `
  SubdomainName=deepfake-analyzer-tool

aws cloudformation describe-stacks --stack-name deepfake-e2e `
  --query "Stacks[0].Outputs" --output table
```

Map outputs to `AWS/.env`:
- `BucketName` -> `S3_BUCKET_NAME`
- `BucketRegion` -> `AWS_REGION`
- `Prefix` -> `S3_PREFIX`
- `UserPoolId` -> `COGNITO_USER_POOL_ID`
- `UserPoolClientId` -> `COGNITO_USER_POOL_CLIENT_ID`
- (Optional) `UserPoolDomain` -> for Hosted UI domain if enabled
- If `CreateIamUser=true`: `AccessKeyId`/`SecretAccessKey` -> `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` (store securely!)
 - API Gateway: `HttpApiEndpoint` and `HttpApiInvokeUrl` — the EC2 user-data already writes `ENGINE_BASE_URL` to point the website at the API Gateway stage URL. If you change this later, update the root `.env` on the instance and restart the website container.

Additional outputs (when EC2 is created):
- `AppPublicIp` — Elastic IP of the instance
- `WebsiteURL` — when ALB is enabled, this is `https://deepfake-analyzer-tool.pentacoresolutions.in`; otherwise `http://<EIP>`
- `EngineDirectURL`, `CreditsDirectURL` — direct service URLs (consider keeping them private and using API Gateway)

Custom domain notes
- The stack can create a DNS-validated ACM certificate and ALB. Provide your Route53 `HostedZoneId`, `RootDomainName` (e.g., `pentacoresolutions.in`), and `SubdomainName` (`deepfake-analyzer-tool`).
- The ALB terminates TLS at 443 and forwards:
  - `/` → Website container port (`WebsiteHostPort`, default 80)
  - `/credits/*` → Credits container port (`CreditsHostPort`)
- The Website container will be configured with:
  - `ENGINE_BASE_URL` pointing to the API Gateway invoke URL (so engine calls go through the gateway, with Cognito auth enforced if enabled)
  - `CREDITS_BASE_URL=https://deepfake-analyzer-tool.pentacoresolutions.in/credits`
- Set `ApiCorsAllowOrigins=https://deepfake-analyzer-tool.pentacoresolutions.in` to restrict browser calls to your domain.

Notes on API Gateway integration
- If `UseInstanceAsApiOrigin=true`, the gateway proxies to the EC2 `Elastic IP` and `EngineHostPort` created by this stack; otherwise it proxies to `EngineOriginUrl`.
- CORS is configured via `ApiCorsAllowOrigins`. Add your website origins (comma-delimited) so browsers can call through the API.
- If `RequireApiJwt=true`, routes (except `/health`) require a Cognito `id_token` in `Authorization: Bearer <token>`. The authorizer uses your Cognito pool issuer and app client audience.
- By default, `ANY /{proxy+}` proxies all engine routes. You can further split public/protected routes by adding more route resources to the template.

ALB and timeouts
- Set ALB idle timeout to 600s to prevent 504s for large videos. Example:
```powershell
aws elbv2 modify-load-balancer-attributes `
  --load-balancer-arn <alb-arn> `
  --attributes Key=idle_timeout.timeout_seconds,Value=600
```

Deprecated/Removed
- A separate Python Auth_Service is no longer used; authentication is handled in the browser via OIDC and enforced server-side by JWT verification when enabled.

