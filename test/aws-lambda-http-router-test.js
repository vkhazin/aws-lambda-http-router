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

const echoEvent = require('./data/echoEvent.json');

const echoHandler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: {
      message: 'It is alive!'
    }
  }
  callback(null, response);
  return Promise.resolve(response);
};
      
describe('aws-lambda-http-router', function() {
  
	describe('#GET: /', function() {
    
		it('Should return statusCode 200', function(done) {
      
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
      
      const httpRouter		    = require('../aws-lambda-http-router').create(routes);
      
      httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
        .then(response => {
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          done();
        });
		});

		it('Path missmatch 404', function(done) {
      
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
      
      const httpRouter		    = require('../aws-lambda-http-router').create(routes);
      
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
        const routes = [
          {
            method: 'POST',
            path: '/echo',
            handler: echoHandler
          }
        ];

        const httpRouter		    = require('../aws-lambda-http-router').create(routes);

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

      const httpRouter		    = require('../aws-lambda-http-router').create(routes);

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
    
    it('Body should be string', function(done) {
      
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
      
      const httpRouter		    = require('../aws-lambda-http-router').create(routes);
      
      httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
        .then(response => {
          assert.equal(typeof(response.body), 'string', 'Body should be string');
          done();
        });
		});
		
		it('Method missmatch: 404', function(done) {
      
      const routes = [
        {
          method: 'GET',
          path: '/echo',
          handler: echoHandler
        }
      ];
      
      const httpRouter		    = require('../aws-lambda-http-router').create(routes);
      
      const echoEvent = {
        resource: "/",
        path: "/echo",
        httpMethod: "PUT",
        body: null,
      };
      
      httpRouter.handler(echoEvent, lambdaContext, lambdaCallback)
        .then(response => {
          assert.equal(response.statusCode, 404, 'Status code should be equal 404');
          done();
        });
		});
		
		it('Should return statusCode 200 for RegEx', function(done) {
      
      const routes = [
        {
          method: 'GET',
          path: '/$doc',
          handler: echoHandler
        },        {
          method: 'GET',
          path: '/$echo',
          handler: echoHandler
        },
        {
          method: 'GET',
          path: '/*',
          handler: (eventData, lambdaContext, lambdaCallback) => {
            const response = {
            statusCode: 200,
            body: {
                fileName: eventData.path
              }
            };
            lambdaCallback(null, response);
            return Promise.resolve(response);            
          }
        }
      ];
      
      const httpRouter		    = require('../aws-lambda-http-router').create(routes);

      const fileName = "/path/to/file";
      const eventData = {
        resource: "/",
        path: fileName,
        httpMethod: "GET",
        body: null,
      };      
      
      httpRouter.handler(eventData, lambdaContext, lambdaCallback)
        .then(response => {
          response.body = JSON.parse(response.body);
          assert.equal(response.statusCode, 200, 'Status code should be equal 200');
          assert.equal(response.body.fileName, fileName, 'File name should be equal: ' + fileName);
          return Promise.reject();
        })
        .then(() => done(), done
        );
		});
  });
  
//   describe('#GET: /world', function() {
    
//     it('Extract path parameter', function(done) {
//       const parametersHandler = (event, context, callback) => {
//         const response = {
//           statusCode: 200,
//           body: {
//             pathParameters: event.pathParameters 
//           }
//         }
//         callback(null, response);
//         return Promise.resolve(response);
//       };
      
//       const routes = [
//         {
//           method: 'GET',
//           path: '/:hello',
//           handler: parametersHandler
//         },
//         {
//           method: 'POST',
//           path: '/',
//           handler: null
//         }
//       ];
      
//       const httpRouter		    = require('../aws-lambda-http-router').create(routes);
//       const lambdaEvent = {
//         resource: "/",
//         path: "/world",
//         httpMethod: "GET",
//         body: null,
//       };
      
//       httpRouter.handler(lambdaEvent, lambdaContext, lambdaCallback)
//         .then(response => {
//           const body = JSON.parse(response.body);
//           assert.equal(body.pathParameters.hello, 'world', 'Path parameters extraction has failed');
//           done();
//         });
// 		});
    
// 	});
  
});