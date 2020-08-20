from flask import Flask
from flask_cors import CORS
from gsa_server.deep_learning.deep_learning_analysis import XlnetModel
import logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)
logging.info("Loadding Model...")
model = XlnetModel()
logging.info("Lodding Complete!")

import gsa_server.views