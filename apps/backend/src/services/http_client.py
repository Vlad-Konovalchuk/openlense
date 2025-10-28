from typing import Dict, Any
from src.utils.http import request_with_retry


class HttpClient:
    async def fetch(self, req: Dict[str, Any]) -> Dict[str, Any]:
        try:
            resp = await request_with_retry(
                method=req["method"],
                url=req["url"],
                params=req.get("params"),
                headers=req.get("headers"),
                data=req.get("data"),
                timeout=req.get("timeout", 10),
            )
            content_type = resp.headers.get("content-type", "")
            if content_type.startswith("application/json"):
                return resp.json()
            else:
                return {"error": "Non-JSON response", "content": await resp.text()}
        except Exception as e:
            return {"error": str(e)}
