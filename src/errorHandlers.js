// error handler middlewares go here
// eh is a function

export const badRequestHandler = (error, res, req, next) => {
  //400 if the error is on my side - send an error in response, otherwise - next
  if (error.status === 400) {
    res.status(400).send({ message: error.message });
  } else {
    next(error);
  }
};
export const unauthorizedHandler = (error, res, req, next) => {
  //401 if the error is on my side - send an error in response, otherwise - next
  if (error.status === 401) {
    res.status(401).send({ message: error.message });
  } else {
    next(error);
  }
};
export const notFoundHandler = (error, res, req, next) => {
  //404 if the error is on my side - send an error in response, otherwise - next
  if (error.status === 404) {
    res.status(404).send({ message: error.message });
  } else {
    next(error);
  }
};

export const genericErrorHandler = (error, req, res, next) => {
  console.log(error); //500 it is very useful to console log the specific error,
  // cause the error messages are server generated - WE WRITE THEM
  res
    .status(500)
    .send({ message: "an error occured, we're gonna fix it asap" });
};
