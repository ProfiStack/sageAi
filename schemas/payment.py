from pydantic import BaseModel


class SubscriptionRequest(BaseModel):
    price_id: str
    type: str
