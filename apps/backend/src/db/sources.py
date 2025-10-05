from sqlalchemy import Column, String, JSON, TIMESTAMP, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()


class Source(Base):
    __tablename__ = "sources"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)
    method = Column(String, nullable=False)
    filters_schema = Column(JSON, nullable=False)
    mapping = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
