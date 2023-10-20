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