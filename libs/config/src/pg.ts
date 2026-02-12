import * as config from 'config'

interface PgConfig {
  user: string
  database: string
  password: string
  host: string
  port: number
  max: number
  idleTimeoutMillis: number
}

export default function getConfig(database: string): PgConfig {
  const pgJsonConfig = config.get<PgConfig>(`pg.${database}`)

  const pgConfig = {
    user: pgJsonConfig.user,
    database: pgJsonConfig.database,
    password: pgJsonConfig.password,
    host: pgJsonConfig.host,
    port: pgJsonConfig.port,
    max: pgJsonConfig.max,
    idleTimeoutMillis: pgJsonConfig.idleTimeoutMillis
  }

  return pgConfig
}
