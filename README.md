##  Apus Service 

## Project Structure
<pre>
apus_service/
├── app/ : apus market server backend
│   ├── router/: web service router 
│   ├── lib/: smart contract connection lib
│   ├── ...
├── contracts: apus market contracts
├── migrations: truffle migrate scripts
├── truffle-config: truffle config
├── server.py: apus backend server main
├── requirement.txt: python dependencies
...
</pre>

##  Usage:

### Run apus server
> listen on 0.0.0.0:80
1. `pip install -r requirements.txt`
2. `python server.py`

### truffle:

`truffle migrate`


### SCroll contract config

> rpc_url https://sepolia-rpc.scroll.io

> chain_id 534351

|合约名称|合约地址||
|-|-|-|
|account |0xa6983d77EBF8C55E153BcBa8E2cd616b512cE0C2||
|market |0x1d77589F3d73E601D35bCA37EB308a714293Cd93||

### Polygon contract config

> rpc_url https://rpc.public.zkevm-test.net

> chain_id 1442

|合约名称|合约地址||
|-|-|-|
|account |0x6E5adBB7d94EAC292AA86A9dAc4990cBA5CA2757||
|market |0x8be7b9a4B379DEb0B9319f8F3cEd6bD093AFa9a9||

### Manta contract config

> rpc_url https://pacific-rpc.testnet.manta.network/http

> chain_id 3441005

|合约名称|合约地址||
|-|-|-|
|account |0x84b0D6e2E0036De4Cbe57C45Cb9111Ce56eb7830||
|market |0x3C584158C2265E804585a4bF61ec5dF8EfeD7a0B||