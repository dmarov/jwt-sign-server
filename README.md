# auth-server

enables to accuire token for jwt authorization

## requirements:

- FreeBSD >= 11.1
- node >= 9.1
- `npm` or `yarn`

## easiest way to generate keys:
cd keys
```
node gen-keys.js
```
or
```
node genkeys --pub my-public.pem --private my-private.pem
```
## run:

```
node index.js
node index.js --config myconfig.yml
node index.js --privateKeyPath /path/to/private.key --port 3003 --tokenExpiresIn 100h
```

## response format
### sucess:
```
{ "token" : "header.payload.signature" }

```
### error:
```
{}

```
