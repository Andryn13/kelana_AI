from dotenv import load_dotenv
import boto3
import os

load_dotenv()

client = boto3.client(
    "bedrock-agent-runtime",
    region_name=os.getenv("AWS_REGION")
)

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("AWS_REGION")
)

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
MODEL_ID = "amazon.nova-lite-v1:0"


def ask_knowledge_base(question: str):
    response = client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalConfiguration={
            "managedSearchConfiguration": {
                "numberOfResults": 5
            }
        },
        retrievalQuery={
            "text": question
        }
    )

    retrieved_results = response.get("retrievalResults", [])

    if not retrieved_results:
        return "I could not find relevant information in the travel knowledge base."

    context = "\n\n".join(
        result["content"]["text"]
        for result in retrieved_results
        if result.get("content", {}).get("text")
    )

    prompt = f"""
You are KelanaAI, a travel assistant.

Answer the user's question using ONLY the information provided
in the knowledge base context below.

If the answer is not available in the context, say that the
information is not available in the knowledge base.

Knowledge base context:
{context}

User question:
{question}
"""

    response = bedrock.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    )

    return response["output"]["message"]["content"][0]["text"]