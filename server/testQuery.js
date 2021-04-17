require('./db/Connection')()
const db = require('./query')

async function init(){
    let a = Date.now()
    await db.getMyInfo()
    console.log('URLS');
    console.log(await db.getUrls());

    console.log('MY SERVER');
    console.log(myServer);

    console.log('MAJORS');
    console.log(await db.getMajors());
    console.log('LEADER');
    console.log(await db.getLeader());
    let b= Date.now()

    await db.updateLeader()

    console.log('LEADER');
    console.log(await db.getLeader());

    console.log('Total ms', b-a);
} 

init()