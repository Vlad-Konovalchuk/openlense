import httpx
import asyncio
from typing import Optional, Dict, Any


async def request_with_retry(
    method: str,
    url: str,
    params: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, Any]] = None,
    retries: int = 3,
    timeout: int = 10,
) -> httpx.Response:
    last_exc = None
    backoff_base = 1.0
    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.request(method, url, params=params, headers=headers)
                resp.raise_for_status()
                return resp
        except httpx.HTTPStatusError as e:
            last_exc = e
            status = e.response.status_code
            if status == 429:
                retry_after = e.response.headers.get("Retry-After")
                wait = (
                    float(retry_after) if retry_after else (backoff_base * (2**attempt))
                )
                await asyncio.sleep(wait)
            else:
                if 500 <= status < 600:
                    await asyncio.sleep(backoff_base * (2**attempt))
                else:
                    raise
        except Exception as e:
            last_exc = e
            await asyncio.sleep(backoff_base * (2**attempt))
    raise last_exc
