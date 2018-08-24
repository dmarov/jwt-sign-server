# auth-server

enables to accuire token for jwt authorization

## requirements:

- FreeBSD >= 11.1
- node >= 9.1
- `npm` or `yarn`

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
