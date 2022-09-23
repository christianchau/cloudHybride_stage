from flask import Flask
import logging

app = Flask(__name__)
 
logging.basicConfig(filename='record.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
 
@app.route('/blogs')
def blog():
    app.logger.info('Info level log')
    app.logger.warning('Warning level log')
    return f"Welcome to the Blog"
 
app.run(host='localhost', debug=True)



import logging
from pythonjsonlogger import jsonlogger
from config import Config


class Logger:
    def __init__(self):
        self.logger = logging.getLogger()
        log_handler = logging.StreamHandler()
        formatter = jsonlogger.JsonFormatter()
        log_handler.setFormatter(formatter)
        level = Config.getLogLevel()
        if level == "DEBUG":
            self.logger.setLevel(logging.DEBUG)
        elif level == "INFO":
            self.logger.setLevel(logging.INFO)
        elif level == "WARN":
            self.logger.setLevel(logging.WARN)
        elif level == "ERROR":
            self.logger.setLevel(logging.ERROR)
        self.logger.addHandler(log_handler)

    def debug(self, message):
        self.logger.debug(message)

    def info(self, message):
        self.logger.info(message)

    def warn(self, message):
        self.logger.warning(message)

    def error(self, message):
        self.logger.error(message)


default_logger = Logger()


def debug(message):
    default_logger.debug(message)


def info(message):
    default_logger.info(message)


def warn(message):
    default_logger.warn(message)


def error(message):
    default_logger.error(message)