module.exports = {
  pg: {
    animaltools: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '12345',
      database: 'animaltools',
      max: 10,
      idleTimeoutMillis: 30000,
    },
  },
  security: {
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@virtualvet.com',
  },
  redis: {
    animaltoolscache: {
      host: 'localhost',
      password: 'S3creT',
      port: 6379,
      tls: false,
    },
  },
  jwt: {
    secret: 'uma_senha_super_secreta_qualquer_para_dev',
    expiresIn: 3600,
  },
  jwtSession: {
    secret: 'outra_senha_super_secreta',
    expiresIn: '3600',
    timeUnity: 's',
  },
  apiCredentials: {
    techagrDs: 'techagr@ds',
    techagrIot: 'techagr@iot',
  },
  animaltoolsAnalyticsApi: {
    url: 'http://localhost:3000',
    paths: {
      complete: '/complete',
    },
    token: 'token_dev',
  },
  animaltoolsJobsApi: {
    url: 'http://localhost:3000',
    paths: {
      publishFeedlotUpdateToIot: '/integration/image/publishFeedlotUpdateToIot',
      integrateIntergadoScalePeriod:
        '/integration/weighing/intergado/integrateScalePeriod',
      integratePersonalbovScalePeriod:
        '/integration/weighing/personalbov/integrateScalePeriod',
      integrateBoschScalePeriod:
        '/integration/weighing/intergado/integrateScalePeriod',
    },
    token: 'token_dev',
  },
  aws: {
    accessKeyId: 'chave_falsa_dev',
    secretAccessKey: 'segredo_falso_dev',
    ses: {
      region: 'us-west-2',
      from: 'teste@exemplo.com',
      fakeEmailTo: 'teste@exemplo.com',
    },
    s3: {
      buckets: {
        animaltoolsImages: {
          region: 'us-west-2',
          name: 'bucket-teste',
        },
      },
    },
  },
  urlWebApp: 'http://localhost:8081',
};
