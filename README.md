# jwt-sign-server

enables to accuire and verify token for jwt authorization

## requirements:

- FreeBSD >= 11.1
- node >= 9.1
- `npm` or `yarn`
- openssl

## easiest way to generate keys:
```
cd keys
./gen-keys.js
```

or

```
cd keys
./gen-keys.js --pub my-public.pem --priv my-private.pem
```

## run:

```
./index.js --help
```
