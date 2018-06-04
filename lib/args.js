const yargs = require('yargs');

const args = yargs
    .option('port', {
        demandOption: true,
        alias: 'p'
    })
    .option('host', {
        demandOption: true,
        default: '0.0.0.0',
        alias: 'h'
    })
    .option('private-key', {
        demandOption: true,
        alias: 'priv',
    })
    .option('public-key', {
        demandOption: true,
        alias: 'pub',
    })
    .option('access-ttl', {
        demandOption: true,
        alias: 'attl',
    })
    .option('refresh-ttl', {
        demandOption: true,
        alias: 'rttl',
    })
    .strict(true)
    .wrap(null)
    .version(`0.0.1`)
    .example(`$0 -p=3002 --priv='keys/private.key' --pub='keys/public.key' --attl='2m' --rttl='30 days'`)
    .parse();

module.exports = args;
