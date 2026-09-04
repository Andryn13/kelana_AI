import os
import boto3

from fastapi import HTTPException

from database import SessionLocal
from models.conversation import Conversation, Message


REGION = os.getenv("AWS_REGION", "ap-southeast-2")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=REGION
)


def create_conversation(user_id: int):
    db = SessionLocal()

    conversation = Conversation(
        user_id=user_id,
        title="New Conversation"
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    db.close()

    return {
        "conversation_id": conversation.id
    }


def list_conversations(user_id: int):
    db = SessionLocal()

    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    result = [
        {
            "id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at
        }
        for conversation in conversations
    ]

    db.close()

    return result


def send_message(
    conversation_id: int,
    user_id: int,
    content: str
):
    db = SessionLocal()

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        .first()
    )

    if conversation is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    # Save user message
    user_message = Message(
        conversation_id=conversation_id,
        role="user",
        content=content
    )

    db.add(user_message)
    db.commit()

    # Load conversation history
    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    # Build prompt/context
    bedrock_messages = []

    for message in messages:
        bedrock_messages.append(
            {
                "role": message.role,
                "content": [
                    {
                        "text": message.content
                    }
                ]
            }
        )

    # Call Amazon Bedrock
    response = bedrock.converse(
        modelId=MODEL_ID,
        messages=bedrock_messages,
        inferenceConfig={
            "maxTokens": 1000,
            "temperature": 0.7
        }
    )

    ai_response = response["output"]["message"]["content"][0]["text"]

    # Save AI response
    assistant_message = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=ai_response
    )

    db.add(assistant_message)
    db.commit()

    db.close()

    return {
        "conversation_id": conversation_id,
        "answer": ai_response
    }


def get_messages(
    conversation_id: int,
    user_id: int
):
    db = SessionLocal()

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        .first()
    )

    if conversation is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    result = [
        {
            "id": message.id,
            "role": message.role,
            "content": message.content,
            "created_at": message.created_at
        }
        for message in messages
    ]

    db.close()

    return result