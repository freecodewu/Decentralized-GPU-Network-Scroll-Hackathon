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


### contract config

> rpc_url https://sepolia-rpc.scroll.io

> chain_id 534351

|合约名称|合约地址||
|-|-|-|
|account |0xa6983d77EBF8C55E153BcBa8E2cd616b512cE0C2||
|market |0x1d77589F3d73E601D35bCA37EB308a714293Cd93||
