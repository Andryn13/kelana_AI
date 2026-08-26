from dotenv import load_dotenv
import boto3
import os

load_dotenv()

AWS_REGION = "ap-southeast-2"
MODEL_ID = "amazon.nova-lite-v1:0"


def generate_recommendation(prompt: str) -> str:
    client = boto3.client(
        "bedrock-runtime",
        region_name=AWS_REGION,
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