import redis.asyncio as redis


class AsyncRedisDatabase:
    def __init__(self, redis_url: str) -> None:
        self.client = redis.from_url(redis_url, decode_responses=True)

    async def close(self) -> None:
        await self.client.aclose()
