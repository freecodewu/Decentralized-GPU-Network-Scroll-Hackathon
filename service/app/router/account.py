# -*- coding:utf-8 -*-

from flask.blueprints import Blueprint
from flask import request, jsonify
from app.controller.machines import mounted_machine, Machine
from app.lib.contract_lib import contract_connector

account_blueprint = Blueprint(name="account", import_name=__name__, url_prefix="/apus/account/")


@account_blueprint.route("/info", methods=['GET'])
def mount_client():
    user_address = request.args.get("address")
    try:
        info = contract_connector.get_account_info(pub_key=user_address)
    except Exception as e:
        return jsonify(dict(code=400, msg=str(e)))
    return jsonify(dict(code=200, data=info.info))


@account_blueprint.route("/bill/earning", methods=['GET'])
def get_earning_bills():
    user_address = request.args.get("address")
    provider_billings, recipient_billings, lease_provider, lease_recipient, devices = contract_connector.get_all()
    own_devices = {_device.market_id: _device for _device in devices if _device.pub_key == user_address}
    own_recipient_lease = {_rb.lease_id: _rb for _rb in lease_recipient if _rb.device_id in own_devices}
    own_recipient_billings = [_rb.data(own_recipient_lease[_rb.lease_id], own_devices[own_recipient_lease[_rb.lease_id].device_id]) for _rb in recipient_billings if _rb.lease_id in own_recipient_lease]

    return jsonify(dict(code=200, items=own_recipient_billings))


@account_blueprint.route("/bill/consume", methods=['GET'])
def get_bill_consume():
    user_address = request.args.get("address")

    provider_billings, recipient_billings, lease_provider, lease_recipient, devices = contract_connector.get_all()
    devices = {_device.market_id: _device for _device in devices}
    own_recipient_lease = {_rb.lease_id: (_rb, devices[_rb.device_id]) for _rb in lease_recipient if _rb.addr == user_address}
    own_recipient_billings = [_rb.data(*own_recipient_lease[_rb.lease_id]) for _rb in recipient_billings if _rb.lease_id in own_recipient_lease]

    return jsonify(dict(code=200, items=own_recipient_billings))
