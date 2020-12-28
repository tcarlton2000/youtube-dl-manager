import logging
import traceback

from flask import jsonify
from werkzeug.exceptions import BadRequest, NotFound

from app.main import app

logger = logging.getLogger("ErrorHandler")


@app.errorhandler(NotFound)
def not_found(error):
    return jsonify(error="404 Not Found", text=str(error)), 404


@app.errorhandler(BadRequest)
def bad_request(error):
    return jsonify(error="400 Bad Request", text=str(error)), 400


@app.errorhandler(Exception)
def exception_handler(error):
    logger.exception(error)
    return (
        jsonify(
            error="500 Internal Server Error",
            message=repr(error),
            stack_trace=traceback.format_exc(),
        ),
        500,
    )
