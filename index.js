var Realm = require('realm')
var faker = require('faker')
var chalk = require('chalk');

const ADMIN_TOKEN = 'acc3ssT0ken...';
const CarSchema = {
    name: 'Car',
    properties: {
        make: 'string',
        model: 'string',
        miles: { type: 'int', default: 0 },
    }
};

Realm.Sync.User.login('http://localhost:9080', 'ilovesushi', 'ilovesushi', (error, user) => {
    if (error) { console.error(error) }
    else {
        console.log('user:', user)
        beginEmitting(user)
    }
});

function beginEmitting(user) {
    var adminUser = Realm.Sync.User.adminUser(ADMIN_TOKEN);
    var realm = new Realm({
        sync: {
            user: user,
            url: `realm://localhost:9080/~/amazing`
        },
        schema: [CarSchema]
    })
    realm.write(() => {
        realm.deleteAll()
    })
    setInterval(() => {
        const payload = {
            make: faker.company.companyName(),
            model: faker.commerce.productName(),
            miles: faker.random.number({ min: 20000, max: 90938 })
        }
        realm.write(() => {
            realm.create('Car', payload)
        })
        console.log(chalk.bgBlue(`Added a new car`, JSON.stringify(payload)))
    }, 2000)
}



