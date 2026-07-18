from pydantic import BaseModel


class Connection(BaseModel):
    url: str


class TableName(BaseModel):
    User: str


class EchoPrintService(BaseModel):
    table_name: TableName


class DbSchema(BaseModel):
    echoprint_service: EchoPrintService


class Sql(BaseModel):
    connection: Connection
    db_schema: DbSchema


class Database(BaseModel):
    sql: Sql
    redis: Connection


class Supabase(BaseModel):
    url: str
    jwks_url: str


class Auth(BaseModel):
    supabase: Supabase


class SystemConfigSetting(BaseModel):
    database: Database
    auth: Auth


class Model(BaseModel):
    system_config_setting: SystemConfigSetting
