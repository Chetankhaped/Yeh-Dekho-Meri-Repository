import os
from typing import Optional

import boto3
from botocore.config import Config as BotoConfig
from botocore.exceptions import BotoCoreError, ClientError
from typing import List, Dict, Any


class S3Client:
    """Thin wrapper over boto3 S3 for simple uploads and URL generation.

    Respects these environment variables:
    - S3_ENABLED: 'true'/'false' (default 'false')
    - AWS_REGION: e.g. 'us-east-1'
    - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN
    - S3_BUCKET_NAME
    - S3_PREFIX: optional path prefix like 'dev'
    """

    def __init__(self) -> None:
        self.enabled = os.getenv("S3_ENABLED", "false").lower() == "true"
        self.bucket = os.getenv("S3_BUCKET_NAME")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.prefix = os.getenv("S3_PREFIX", "")
        if self.prefix and self.prefix.endswith("/"):
            self.prefix = self.prefix[:-1]

        self._client = None
        if self.enabled and self.bucket:
            session = boto3.session.Session(
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID") or None,
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY") or None,
                aws_session_token=os.getenv("AWS_SESSION_TOKEN") or None,
                region_name=self.region,
            )
            self._client = session.client(
                "s3",
                config=BotoConfig(retries={"max_attempts": 3, "mode": "standard"}),
            )

    def is_enabled(self) -> bool:
        return self.enabled and self._client is not None and bool(self.bucket)

    def _key(self, key: str) -> str:
        if self.prefix:
            return f"{self.prefix}/{key.lstrip('/')}"
        return key.lstrip('/')

    def upload_file(self, local_path: str, key: str, content_type: Optional[str] = None) -> bool:
        """Upload a local file to S3 at the given key.
        Returns True on success, False otherwise.
        """
        if not self.is_enabled():
            return False
        # Avoid setting ACL explicitly; rely on bucket's default (private)
        extra = {}
        if content_type:
            extra["ContentType"] = content_type
        try:
            if extra:
                self._client.upload_file(local_path, self.bucket, self._key(key), ExtraArgs=extra)
            else:
                # Pass without ExtraArgs when not needed
                self._client.upload_file(local_path, self.bucket, self._key(key))
            return True
        except (BotoCoreError, ClientError):
            return False

    def put_bytes(self, data: bytes, key: str, content_type: Optional[str] = None) -> bool:
        if not self.is_enabled():
            return False
        # Avoid setting ACL explicitly; rely on bucket's default (private)
        kwargs = {}
        if content_type:
            kwargs["ContentType"] = content_type
        try:
            self._client.put_object(Bucket=self.bucket, Key=self._key(key), Body=data, **kwargs)
            return True
        except (BotoCoreError, ClientError):
            return False

    def presigned_url(self, key: str, expires: int = 3600) -> Optional[str]:
        if not self.is_enabled():
            return None
        try:
            return self._client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket, "Key": self._key(key)},
                ExpiresIn=expires,
            )
        except (BotoCoreError, ClientError):
            return None

    def object_url(self, key: str) -> Optional[str]:
        if not self.is_enabled():
            return None
        k = self._key(key)
        return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{k}"

    def head_object(self, key: str) -> Optional[Dict[str, Any]]:
        if not self.is_enabled():
            return None
        try:
            return self._client.head_object(Bucket=self.bucket, Key=self._key(key))
        except (BotoCoreError, ClientError):
            return None

    def get_object_text(self, key: str, encoding: str = "utf-8") -> Optional[str]:
        if not self.is_enabled():
            return None
        try:
            obj = self._client.get_object(Bucket=self.bucket, Key=self._key(key))
            data = obj["Body"].read()
            return data.decode(encoding)
        except (BotoCoreError, ClientError, Exception):
            return None

    def list_common_prefixes(self, prefix: str) -> List[str]:
        """List 'folders' (common prefixes) directly under the given prefix."""
        if not self.is_enabled():
            return []
        try:
            paginator = self._client.get_paginator('list_objects_v2')
            result: List[str] = []
            for page in paginator.paginate(Bucket=self.bucket, Prefix=self._key(prefix), Delimiter='/'):
                for cp in page.get('CommonPrefixes', []):
                    pfx = cp.get('Prefix')
                    if pfx:
                        # Strip the leading prefix if needed to make it friendlier for callers
                        result.append(pfx)
            return result
        except (BotoCoreError, ClientError):
            return []

    def list_objects(self, prefix: str) -> List[Dict[str, Any]]:
        """List all objects under the prefix (no delimiter)."""
        if not self.is_enabled():
            return []
        try:
            paginator = self._client.get_paginator('list_objects_v2')
            items: List[Dict[str, Any]] = []
            for page in paginator.paginate(Bucket=self.bucket, Prefix=self._key(prefix)):
                for obj in page.get('Contents', []):
                    items.append({
                        'Key': obj.get('Key'),
                        'LastModified': obj.get('LastModified'),
                        'Size': obj.get('Size'),
                        'ETag': obj.get('ETag'),
                    })
            return items
        except (BotoCoreError, ClientError):
            return []

    def delete_object(self, key: str) -> bool:
        """Delete a single object by key."""
        if not self.is_enabled():
            return False
        try:
            self._client.delete_object(Bucket=self.bucket, Key=self._key(key))
            return True
        except (BotoCoreError, ClientError):
            return False

    def delete_prefix(self, prefix: str) -> bool:
        """Delete all objects under the given prefix.

        Uses pagination and batch delete for efficiency.
        Returns True if completed without client errors, False otherwise.
        """
        if not self.is_enabled():
            return False
        # Normalize prefix and ensure it ends with '/'
        norm = self._key(prefix)
        if norm and not norm.endswith('/'):
            norm = norm + '/'
        try:
            paginator = self._client.get_paginator('list_objects_v2')
            page_iter = paginator.paginate(Bucket=self.bucket, Prefix=norm)
            keys_batch = []
            for page in page_iter:
                contents = page.get('Contents', [])
                for obj in contents:
                    keys_batch.append({'Key': obj['Key']})
                    # Delete in batches of up to 1000
                    if len(keys_batch) >= 1000:
                        self._client.delete_objects(Bucket=self.bucket, Delete={'Objects': keys_batch})
                        keys_batch = []
            if keys_batch:
                self._client.delete_objects(Bucket=self.bucket, Delete={'Objects': keys_batch})
            return True
        except (BotoCoreError, ClientError):
            return False
