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
          console.log(response);
          assert.equal(typeof(response.body), 'string', 'Body should be string');
          done();
        });
		});
    
	});
  
});