const assert            = require('assert')

const lambdaCallback = (err, result) => {
  console.log('Lambda Callback(err, result):');
  console.log('result: ', result);
  console.error('err: ', err);
};

const lambdaContext = {
  succeed: (data) => {
    console.log(data);
  },
  fail: (err) => {
    console.error(err);
  }
};

describe('http-router', function() {
  
	describe('#GET: /', function() {
    
		it('Should return statusCode 200', function(done) {
      const echoHandler = (event, context, callback) => {
        const response = {
          statusCode: 200,
          body: 'I am alive'
        }
        callback(null, response);
        return Promise.resolve(response);
      }
      
      const routes = [
        {
          method: 'GET',
          path: '/',
          handler: echoHandler
        },
        {
          method: 'POST',
          path: '/',
          handler: echoHandler
        }
      ];
      
      const httpRouter		    = require('../http-router').create(routes);
      
      const echoEvent = {
        resource: "/",
        path: "/",
        httpMethod: "GET",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.8",
          "Cache-Control": "max-age=0",
          "CloudFront-Forwarded-Proto": "https",
          "CloudFront-Is-Desktop-Viewer": "true",
          "CloudFront-Is-Mobile-Viewer": "false",
          "CloudFront-Is-SmartTV-Viewer": "false",
          "CloudFront-Is-Tablet-Viewer": "false",
          "CloudFront-Viewer-Country": "BS",
          DNT: "1",
          Host: "oqrzdhckn8.execute-api.us-east-2.amazonaws.com",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
          "Via": "1.1 85da55ad6484d43ed71e004ad6f0496f.cloudfront.net (CloudFront)",
          "X-Amz-Cf-Id": "vUWr64h90lzJf8sRDnYC7oIJC3MJEYNy9HPxW1X1UtgTaICkcGNuig==",
          "X-Amzn-Trace-Id": "Root=1-5970c7dd-1ebf6ec97c53a8f8519b39a1",
          "X-Forwarded-For": "108.60.230.202, 54.239.140.75",
          "X-Forwarded-Port": "443",
          "X-Forwarded-Proto": "https"
        },
        queryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {
          path: "/poc/",
          accountId: "811322200214",
          resourceId: "ag8lo7kr1e",
          stage: "poc",
          requestId: "8c44458a-6d5d-11e7-998a-e98ca284c3df",
          identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            apiKey: "",
            sourceIp: "108.60.230.202",
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            user: null
          },
          resourcePath: "/",
          httpMethod: "GET",
          apiId: "oqrzdhckn8"
        },
        body: null,
        isBase64Encoded: false
      };
      
      httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
        .then(response => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          done();
        });
		});

		it('Path missmatch 404', function(done) {
      const echoHandler = (event, context, callback) => {
        const response = {
          statusCode: 200,
          body: 'I am alive'
        }
        callback(null, response);
        return Promise.resolve(response);
      }
      
      const routes = [
        {
          method: 'GET',
          path: '/',
          handler: echoHandler
        },
        {
          method: 'POST',
          path: '/',
          handler: echoHandler
        }
      ];
      
      const httpRouter		    = require('../http-router').create(routes);
      
      const echoEvent = {
        resource: "/",
        path: "/echo",
        httpMethod: "GET",
        body: null,
      };
      
      httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
        .then(response => {
          assert.equal(response.statusCode, 404, 'Status code should be equal 404');
          done();
        });
		});
    
    it('Method missmatch 404', function(done) {
        const echoHandler = (event, context, callback) => {
          const response = {
            statusCode: 200,
            body: 'I am alive'
          }
          callback(null, response);
          return Promise.resolve(response);
        }

        const routes = [
          {
            method: 'POST',
            path: '/echo',
            handler: echoHandler
          }
        ];

        const httpRouter		    = require('../http-router').create(routes);

        const echoEvent = {
          resource: "/",
          path: "/echo",
          httpMethod: "GET",
          body: null,
        };

        httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
          .then(response => {
            assert.equal(response.statusCode, 404, 'Status code should be equal 404');
            done();
          });
      });    

    it('Multi-match 500', function(done) {
      const echoHandler = (event, context, callback) => {
        const response = {
          statusCode: 200,
          body: 'I am alive'
        }
        callback(null, response);
        return Promise.resolve(response);
      }

      const routes = [
        {
          method: 'GET',
          path: '/echo',
          handler: echoHandler
        },
        {
          method: 'GET',
          path: '/echo',
          handler: echoHandler
        }
      ];

      const httpRouter		    = require('../http-router').create(routes);

      const echoEvent = {
        resource: "/",
        path: "/echo",
        httpMethod: "GET",
        body: null,
      };

      httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
        .then(response => {
          assert.equal(response.statusCode, 500, 'Status code should be equal 500');
          done();
        });
    }); 
    
	});
  
});