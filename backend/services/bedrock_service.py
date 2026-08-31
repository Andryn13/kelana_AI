from dotenv import load_dotenv
import boto3
import os

load_dotenv()

AWS_REGION = "ap-southeast-2"
MODEL_ID = "amazon.nova-lite-v1:0"

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


def generate_recommendation(prompt: str) -> str:
    client = boto3.client(
        "bedrock-runtime",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )

    response = client.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ],
            }
        ],
    )

    return response["output"]["message"]["content"][0]["text"]