const axios = require('axios')

async function testGET(){
    console.time("执行1000次GET 共花费了");
    for (let index = 0; index < 1000; index++) {
        let res = await axios.get('http://localhost:8000/test')
    }
    console.timeEnd("执行1000次GET 共花费了");
}

testGET()