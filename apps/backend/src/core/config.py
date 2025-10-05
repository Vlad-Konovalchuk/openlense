from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "OpenLense Backend"
    database_url: str = "postgresql+psycopg2://user:password@localhost:5432/openlense"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()