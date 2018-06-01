const yargs = require('yargs');

const args = yargs
    .option('port', {
        demandOption: true,
        alias: 'p'
    })
    .option('host', {
        demandOption: true,
        default: 'localhost',
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
    .option('attl', {
        demandOption: true,
        alias: 'accl',
    })
    .option('rttl', {
        demandOption: true,
        alias: 'refrl',
    })
    .strict(true)
    .wrap(null)
    .version(`0.0.1`)
    .example(`$0 -p=3002 --priv='keys/private.key' --pub='keys/public.key' --attl='2m' --rttl='30 days'`)
    .parse();

module.exports = args;
