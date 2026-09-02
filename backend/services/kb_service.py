import boto3
import os

client = boto3.client(
    "bedrock-agent-runtime",
    region_name=os.getenv("AWS_REGION")
)

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")


def ask_knowledge_base(question: str):
    response = client.retrieve_and_generate(
        input={
            "text": question
        },
        retrieveAndGenerateConfiguration={
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": KNOWLEDGE_BASE_ID,
                "modelArn": os.getenv("BEDROCK_MODEL_ARN"),
            },
        },
    )

    return response["output"]["text"]