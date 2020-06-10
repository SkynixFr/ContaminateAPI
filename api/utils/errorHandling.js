function CustomException(message, code, url, http_method) {
  const error = new Error(message);
  error.code = code;
  error.http_method = http_method;
  error.url = url;
  return error;
}

CustomException.prototype = Object.create(Error.prototype);

function errorHandler(err, req, res, next) {
  //on récupère les informations contenues dans l'erreur personnalisée
  const code = err.code || 500;
  const message = err.message || "";
  const url = err.url || "";
  const method = err.http_method || "";
  res
    .status(code)
    .json({ message: message, url: url, method: method, code: code });
}

module.exports = { CustomException, errorHandler };
