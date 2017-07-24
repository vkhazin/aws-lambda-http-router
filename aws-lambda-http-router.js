'use strict';
const pathMatch         = require('path-match')();

exports.create =  function (routes) {

  //Create collection of RegExps
  const routesWithRegExp = routes.map(route => {
      route.pathRegExp = pathMatch(route.path);
      return route;
  });

  //Filter routes by method
  const filterByMethod = (routes, method) => {
    const methodLowerCase = method.toLowerCase();
    const filteredRoutes = routes.filter(route => route.method.toLowerCase() === methodLowerCase);
    return filteredRoutes;
  };

  //Filter routes by path
  const filterByPath = (routes, path) => {
    const filteredRoutes = routes.filter(route => {
      return route.pathRegExp(path) !== false
    });
    return filteredRoutes;
  };
  
  //No rout found response
  const response404 = (event, context, callback) => {
    const response = {
      statusCode: 404,
      body: `No route found for method: [${event.httpMethod}] and route: [${event.path}]`
    };
    callback(null, response);
    return Promise.resolve(response);
  };

  //Multiple routes found response
  const responseMultiple = (event, context, callback) => {
    const response = {
      statusCode: 500,
      body: `Multiple routes found for method: [${event.httpMethod}] and route: [${event.path}]`
    };
    callback(null, response);
    return Promise.resolve(response);
  };
  
  
  //Body stringifier callback
  const wrappedCallback = (lambdaCallback) => {
    return function(err, response) {
      if (err) {
        lambdaCallback(err, response);
        return Promise.reject(err);
      } else {
        if ((response.body != null) && (typeof(response.body) != 'string')) {
          response.body = JSON.stringify(response.body);
        }
        lambdaCallback(null, response);
        return Promise.resolve(response);
      }
    };
  };
  
  
  //Lambda handler
  const handler = (event, context, callback) => {
    const filteredByMethod = filterByMethod(routesWithRegExp, event.httpMethod);
    const filteredByPath = filterByPath(filteredByMethod, event.path);

    if (filteredByPath.length == 0) {
      return response404(event, context, callback);
    } else if (filteredByPath.length > 1) {
      return responseMultiple(event, context, callback);
    } else {
      const route = filteredByPath[0];
      event.pathParameters = route.pathRegExp(event.path);
      return route.handler(event, context, wrappedCallback(callback));
    }
  };
  
  return (function () {
    return {      
      handler: handler
    };
  }());
};