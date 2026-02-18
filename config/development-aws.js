module.exports = {
  pg: {
    animaltools: {
      user: 'postgres',
      database: 'animaltools',
      password: '12345',
      host: 'localhost',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000,
    },
  },
  redis: {
    animaltoolscache: {
      host: 'beeftrader-dev.appbeeftrader-br.com',
      password: 'BYDWMuFUCAjAuaLlWjqEhVW0zAPyrY',
      port: 6380,
      tls: false,
    },
  },
  jwt: {
    secret: '$ecr3t',
    expiresIn: '1y',
  },
  jwtSession: {
    secret: '$ecr3t',
    expiresIn: '3600',
    timeUnity: 's', // 1 hour
  },
  apiCredentials: {
    techagrDs: 'techagr@ds',
    techagrIot: 'techagr@iot',
  },
  animaltoolsAnalyticsApi: {
    url: 'http://servidortech.local/api/analytics',
    paths: {
      complete: '/complete',
    },
    token: 'XXXXXX',
  },
  animaltoolsJobsApi: {
    url: 'http://animaltools-jobs:3002/api',
    paths: {
      publishFeedlotUpdateToIot: '/integration/image/publishFeedlotUpdateToIot',
      integrateIntergadoScalePeriod:
        '/integration/weighing/intergado/integrateScalePeriod',
      integratePersonalbovScalePeriod:
        '/integration/weighing/personalbov/integrateScalePeriod',
      integrateBoschScalePeriod:
        '/integration/weighing/intergado/integrateScalePeriod',
    },
    token: 'XXXXXX',
  },
  aws: {
    accessKeyId: 'XXXXXX',
    secretAccessKey: 'XXXXXX/FFbYTzoBZPeC076W',
    ses: {
      region: 'us-west-2',
      from: 'arrobatechinova@gmail.com',
      fakeEmailTo: 'titechinovacao@gmail.com',
    },
    s3: {
      buckets: {
        animaltoolsImages: {
          region: 'sa-east-1',
          name: 'animaltools-images-bucket',
        },
      },
    },
  },
  urlWebApp: 'www.appanimaltools-br.com',
  integration: {
    bovitrato: {
      auth: {
        username: 'usuario',
        password: 'XXXXXX',
      },
      baseUrl: 'http://b1.ativy.com:20199/',
      consumption: 'http://b1.ativy.com:20199/pecuaria/lote/consumoLotesAtuais',
    },
    dojot: {
      auth: {
        scope: 'openid',
        username: 'admin',
        password: 'XXXXXX',
      },
      baseUrl: 'http://144.22.220.7:8000',
    },
  },
};
