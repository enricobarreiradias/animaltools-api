module.exports = {
  pg: {
    animaltools: {
      user: 'postgres',
      database: 'animaltools',
      password: 'pwd',
      host: 'localhost',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000
    },
  },
  redis: {
    animaltoolscache: {
      host: 'redis://user[:port]@host:port',
      password: 'S3creT',
      port: 6379,
      tls: false
    }
  },
  jwt: {
    secret: '$ecr3t',
    expiresIn: 3600
  },
  jwtSession: {
    secret: '$ecr3t',
    expiresIn: '3600',
    timeUnity: 's' // 1 hour
  },
  apiCredentials: {
    techagrDs: 'techagr@ds',
    techagrIot: 'techagr@iot'
  },
  animaltoolsAnalyticsApi: {
    url: 'http://',
    paths: {
      complete: '/complete'
    },
    token: '$ecret'
  },
  animaltoolsJobsApi: {
    url: 'http://',
    paths: {
      publishFeedlotUpdateToIot: '/integration/image/publishFeedlotUpdateToIot',
      integrateIntergadoScalePeriod: '/integration/weighing/intergado/integrateScalePeriod',
      integratePersonalbovScalePeriod: '/integration/weighing/personalbov/integrateScalePeriod',
      integrateBoschScalePeriod: '/integration/weighing/intergado/integrateScalePeriod'
    },
    token: '$ecret'
  },
  aws: {
    accessKeyId: 'foo',
    secretAccessKey: 'bar',
    ses: {
      region: 'us-west-2',
      from: 'arrobatechinova@gmail.com',
      fakeEmailTo: 'titechinovacao@gmail.com'
    },
    s3: {
      buckets: {
        animaltoolsImages: {
          region: 'us-west-2',
          name: 'animaltools-images-dev'
        }
      }
    }
  },
  urlWebApp: 'http://localhost:8081'
}
