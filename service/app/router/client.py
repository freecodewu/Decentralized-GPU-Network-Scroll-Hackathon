# -*- coding:utf-8 -*-

from flask.blueprints import Blueprint
from flask import request, jsonify
from app.controller.machines import mounted_machine, Machine
client_blueprint = Blueprint(name="client_blueprint", import_name=__name__, url_prefix="/apus_network/client/")


@client_blueprint.route("/mount", methods=['POST'])
def mount_client():
    client_info = request.get_json()
    try:
        mounted_machine.register(Machine(machine_id=client_info.get("machine_id"), pub_key=client_info.get("pub_key"), host=client_info.get("host"), port=client_info.get("port"), server_info=client_info.get("server_info"), api_version=client_info.get("api_version")))
    except Exception as e:
        return jsonify(dict(code=400, msg=str(e)))

    return jsonify(dict(code=200, msg="ok"))

