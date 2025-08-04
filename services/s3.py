
import boto3
from botocore.exceptions import ClientError
import base64
import uuid
from dotenv import load_dotenv
import os

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")
BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)
BUCKET_NAME = "sageai-products"

def upload_base64_image_to_s3(base64_str: str) -> str:
    # Clean base64 header if exists
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]

    image_data = base64.b64decode(base64_str)
    filename = f"{uuid.uuid4().hex}.jpg"

    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=image_data,
            ContentType="image/jpeg",
        )
    except ClientError as e:
        print(f"S3 Upload failed: {e}")
        raise

    # Construct the public URL (if your bucket is public)
    url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"
    return filename, url

def delete_s3_image(filename: str):
    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=filename)
    except ClientError as e:
        print(f"Failed to delete {filename} from S3: {e}")
