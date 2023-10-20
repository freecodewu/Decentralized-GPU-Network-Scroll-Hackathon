import enum

import json
from web3 import Web3
from flask import Flask, request, jsonify
from flask_cors import CORS

from app.router import register_blueprint

app = Flask(__name__)

# 注册蓝图
register_blueprint(app)

if __name__ == '__main__':
    CORS(app, methods=['GET', 'HEAD', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'], allow_headers=['*'])
    app.run(host='0.0.0.0', port=80)