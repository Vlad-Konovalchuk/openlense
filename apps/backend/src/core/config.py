from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "OpenLense Backend"
    database_url: str
    db_type: str
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()