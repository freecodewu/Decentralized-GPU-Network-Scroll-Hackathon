import time

class Instance:
    def __init__(self, addr, lease_id, start_time, end_time, device_id):
        self.addr = addr
        self.lease_id = lease_id
        self.start_time = start_time
        self.end_time = end_time
        self.device_id = device_id

    @classmethod
    def init_from_contract(cls, addr, lease_id, start_time, end_time, device_id):
        # demo '0xA24d5b9CEFDe16cEfB488040B4f7de99e4dE92bB', 2, 1694053093, 1694053103, 2
        return Instance(addr, lease_id, start_time, end_time, device_id)

    def instance_info(self, machine):
        return dict(info=machine.data, instance_id=self.lease_id, status=dict(state="renting" if self.end_time > int(time.time()) else "end", lease_expire=self.end_time, rent_from=machine.pub_key, lease_start=self.start_time), connection=dict(ssh_user_name="root", ssh_password="password", ssh_ip='35.91.235.139', ssh_port=33))

    @property
    def data(self):
        return dict(addr = self.addr ,lease_id = self.lease_id ,start_time = self.start_time ,end_time = self.end_time ,device_id = self.device_id)



class Billing:
    def __init__(self, addr, bill_id, lease_id, provider_blocked_fund, recipient_blocked_funds, amount, status, bill_type):
        self.addr = addr
        self.bill_id = bill_id
        self.lease_id = lease_id
        self.provider_blocked_fund = provider_blocked_fund
        self.recipient_blocked_funds = recipient_blocked_funds
        self.amount = amount
        self.status = status
        self.bill_type = bill_type

    @classmethod
    def init_from_contract(cls, addr, bill_id, lease_id, provider_blocked_fund, recipient_blocked_funds, amount, status, bill_type):
        return Billing(addr, bill_id, lease_id, provider_blocked_fund, recipient_blocked_funds, amount, status, bill_type)

    def data(self, instance, machine):
        return dict(sku="server", instance_id=instance.lease_id, server_id=machine.market_id, amount=self.amount, recipient_address=self.addr, provider_address=machine.pub_key, setlle_at=instance.end_time, start_time=instance.start_time, price=machine.price.data)
