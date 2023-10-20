# -*- coding:utf-8 -*-

from flask import request, jsonify
from flask.blueprints import Blueprint
from app.lib.contract_lib import contract_connector
from app.controller.machines import mounted_machine, Machine
machine_blueprint = Blueprint(name="machine_blueprint", import_name=__name__, url_prefix="/apus_network/server/")


@machine_blueprint.route("/info", methods=['GET'])
def get_mount_server():
    machine_id = request.args.get("machine_id")
    address = request.args.get("address")
    try:
        machine = mounted_machine.get(address, machine_id)
    except Exception as e:
        return jsonify(dict(code=400, msg=str(e)))
    return jsonify(dict(code=200, data=dict(server_info=machine.contract_server_info)))


@machine_blueprint.route("/provider/list")
def list_server():
    # offset = int(request.args.get("offset"))
    # limit = int(request.args.get("limit"))
    address = request.args.get("address")
    d_machines = mounted_machine.list(address)
    d_machines = {machine.machine_id: machine for machine in d_machines.values()}

    try:
        c_machines = contract_connector.list_own_devices(type("owner", (), dict(public_key=address)), 100, 0)
        c_machines = {machine.machine_id: machine for machine in c_machines}
    except Exception as e:
        return jsonify(dict(code=400, msg="contract rpc: get_all err")
                       )

    # merge online & created address
    result = []
    for machine_id, machine in d_machines.items():
        if machine_id not in c_machines:
            result.append(machine)

    for machine in c_machines.values():
        result.append(machine)

    result = [item.data for item in result]
    return jsonify(dict(code=200, data=result))


@machine_blueprint.route("/market/list")
def list_market_server():
    offset = int(request.args.get("offset"))
    limit = int(request.args.get("limit"))
    try:
        # c_machines = contract_connector.list_devices(limit, offset)
        _, _, _, _, c_machines = contract_connector.get_all()
        result = [item.data for item in c_machines if item.status == 1]
    except Exception as e:
        return jsonify(dict(code=400, msg="contract rpc:listMachine err"))
    return jsonify(dict(code=200, data=result))


@machine_blueprint.route("/instance/list")
def list_instance():
    user_address = request.args.get("address")

    provider_billings, recipient_billings, lease_provider, lease_recipient, devices = contract_connector.get_all()

    own_release = [_rb for _rb in lease_recipient if _rb.addr == user_address]
    # device_ids = {_rb.device_id: _rb for _rb in own_release}
    rent_devices = {_device.market_id: _device for _device in devices}

    result = [_instance.instance_info(rent_devices[_instance.device_id]) for _instance in own_release]
    result = [i for i in result if i["status"]["state"] != "end"]

    return jsonify(dict(code=200, items=result))
