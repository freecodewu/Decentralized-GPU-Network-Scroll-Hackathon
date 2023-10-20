import json

from app.model.machine import Machine


class MountedMachine:

    _machines = dict()

    def __init__(self):
        pass

    def register(self, machine):

        machines = self._machines.get(machine.pub_key, dict())
        machines[machine.pub_key] = machine

        self._machines[machine.pub_key] = machines
        if self._machines.get(machine.pub_key, dict()).get(machine.machine_id, None) is not None:
            raise Exception("machine_id exit")

    def get(self, address, machine_id):
        ownMachines = self._machines.get(address, dict())
        if ownMachines.get(machine_id, None) is None:
            raise Exception("machine not exit")
        return ownMachines[machine_id]

    def list(self, address):
        return self._machines.get(address, dict())


mounted_machine = MountedMachine()