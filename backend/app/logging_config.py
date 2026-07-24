import json
import logging
import sys
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    def format(self, record):
        log = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "event": getattr(record, "event", record.getMessage()),
            "logger": record.name,
        }
        if record.exc_info and record.exc_info[1]:
            log["error_type"] = type(record.exc_info[1]).__name__
            log["error_detail"] = str(record.exc_info[1])
        for key in ("email", "slug", "status_code", "duration_ms", "method",
                     "path", "client_ip", "admin_email", "reason", "fields",
                     "count", "total", "page", "limit", "tag", "status",
                     "filename", "content_type", "public_id", "url",
                     "already_subscribed", "source", "database_name"):
            val = getattr(record, key, None)
            if val is not None:
                log[key] = val
        return json.dumps(log, default=str)


def setup_logging():
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
