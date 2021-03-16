const fs = require('fs')
let payload = { "type": "script", "mime": "application/json", "name": "code", "body": "W3siaWQiOiJkdU5oYjFOfnpxTDE9UDBvN0IxWyIsIm9wY29kZSI6InNvdW5kX3BsYXl1bnRpbGRvbmUiLCJpbnB1dHMiOnsiU09VTkRfTUVOVSI6eyJuYW1lIjoiU09VTkRfTUVOVSIsImJsb2NrIjoieSUtMSlwaWJnW2Q/RW9rSENEaSwiLCJzaGFkb3ciOiJ5JS0xKXBpYmdbZD9Fb2tIQ0RpLCJ9fSwiZmllbGRzIjp7fSwibmV4dCI6bnVsbCwidG9wTGV2ZWwiOnRydWUsInBhcmVudCI6bnVsbCwic2hhZG93IjpmYWxzZX0seyJpZCI6InklLTEpcGliZ1tkP0Vva0hDRGksIiwib3Bjb2RlIjoic291bmRfc291bmRzX21lbnUiLCJpbnB1dHMiOnt9LCJmaWVsZHMiOnsiU09VTkRfTUVOVSI6eyJuYW1lIjoiU09VTkRfTUVOVSIsInZhbHVlIjoi5ZW1In19LCJuZXh0IjpudWxsLCJ0b3BMZXZlbCI6ZmFsc2UsInBhcmVudCI6ImR1TmhiMU5+enFMMT1QMG83QjFbIiwic2hhZG93Ijp0cnVlfV0=", "thumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAeAGADASIAAhEBAxEB/8QAHAAAAAcBAQAAAAAAAAAAAAAAAAMEBgcICQUB/8QANxAAAQMDAgMFBAkFAQAAAAAAAQIDBAUGEQAhBxIxCBMiQdMYUVaVFBUXMlJhZXF1I3KBkqHS/8QAGQEBAAMBAQAAAAAAAAAAAAAABAIDBQYB/8QALREAAQIEBAUDBAMAAAAAAAAAAQIDAAQFEQYhMUESE2GR0VGh4RQWsbIygfD/2gAMAwEAAhEDEQA/ANAONfGp/hO9So0W30VJ2pJecJcf7pKEoKRjYEkkqHl5aQ8PO0rZd1xXUXRJi23OZVsiTIHdOpx1S4QBkbgg79D56ZXa0jNzLmsuG8sobfEhtShjICnGQTuQPPzIGuNVeAVpQVQVCsVZtiRMLLjpU07hsJWrISlIwcI65OPcemuol5GQXItl64Wq+YvsTtp7R2crTqY5TmlTAKVrubi50J2006RKnELtH2TadPbXbU6Fcc95WEsxZILbafxLWkEDfYDr5/vHXtjVj4Dh/MFenpvjgtZ0WvN02dcdQXFMNElx9Iba5crDeckK2UoqwCBy8u5PXRUDg/adRelohzqi8hqT9FaWmR1V3SV+LEcgffQOo2UT1TyljEjSm0WUkq3ubj8WhsvTqI03ZaSve5uPwRDkPbHq4GTYcMD+QV6eiD21ZYODZlP2/Ulenqt9wKCFBllfM0VqwoE4UB06gH/g/Yak6r8EKBT7Ck3Z9czmH2KciWhDvKpLrhCTgDlGEnOAebqpPXGFaTlJpTHDzG/5GwzV5jYdoVFl+Dmt24jYZq8xIQ7assnAsyn7/qSvT0eO2PVyMiw4ZH8gr09VQ04bNYZn1KPTpry24zshtC1owVJSo4OM7avXQKchPFy/c+YS7helNpKuVp1V5ix/tjVj4Dh/MFenoe2NWPgOH8wV6em3UOEFmsS4EeNU6m2JReCzIkspwUNlQSMoBz0yQD+2CSlfTeAtsSaq7AfrctZSw04htiWwV8x50r5jykgcyFY8PQHfOsoy9GSOIt/t5jEMrQEp4i1+3rb1jq+2NWPgOH8wV6epN4KcanuLD1VjSqAimu01LLmW3+8StKyoY3AII5Pd56g/7EaI5NqcZmqSEpgyfo/9SYwFp2SoHGPESk9Dyb+8bl1dkWOqJcN4xFJWkstxmyF45gQt4b4JGdvI6PPydO+jcclk2Um253I6wSpyFK+gddlEWUkJOp3I9TC/tW0C56lUrXqdvUipSjDTIBdhMrcW04VNqSfACUnwkg/lqAJ10X7CfMGp3BcEZ9hXMWZEp9C21e/lUQQd/wDutCdM+9+E1i8Q5EeXc9IL0iMkoS806ppZT+FSkkEgHcA9NDptcblm0sPt3SL57630PmA0jEbUm0iWmG7pTfMZnM30PmKOGqXVX1CmfWFWqSpC8iMHXXy4r+zJ5jsPLy11oFG4r0pkx6XRbwhtFZcKI8SU2kqIA5sJAGcAb/kNXLsrhFYXD+W7ULaovcynU8heeeW8tKfMJKyeXPnjTy0t/EyAeFlq6euXsLw2Yxg2FcEuzdPXL2F4zsk8PL0lN925ZVw9cgilv5B/016zZnFuPTzSI9Pu9qCQpP0ZEKWGiFAhXgA5dwTnbfJ1oloah91OHItDv8RD72etYsjv8Rm79lV9/CVf+Uv/APnS+Nw8vSK33bdlXD1ySaW/kn/TWiehr04seOrY7xJWOH1atDufEZ/u0Dik8I4eoF2uCI2pqPzQ5R7lChgpRlPhBBOQNtKm4vGVlQW1CvdCgEpBSxMBASCEjp5AkD3AnV9tDVRxMo5Fkf7+opOMFHIsJ7/EUHMLjEqQiWqBepfbKih0sTOdJV97BxkZwM+/Gps7J9u3JSahc06u0WoQkyW4yErmMLaLiwpwq++ASfED/nVjNDRpyvKm2FMcsJvbTobwOfxKudllS3KCQq2Y6G8f/9k=" }

const decodeBody = (str) => Buffer.from(str, 'base64').toString('utf8');
const decodeImage = (str) => Buffer.from(str, 'base64');

// console.log(decode(payload.body), JSON.parse(decode(payload.body)))


function saveBackpack(payload) {
    let body = decodeBody(payload.body)
    let image = decodeImage(payload.thumbnail)
    fs.writeFileSync('/tmp/body.json', body)
    fs.writeFileSync('/tmp/thumbnail.jpeg', image)
    return {
        body: "701ff157723c19a59914fdf73bcf40bf.json",
        id: "3def2b82-4a1b-409d-8673-000c230cc5c9",
        mime: "application/json",
        name: "code",
        thumbnail: "a92d9d4a1539a1a43e93ae85a14779b6.jpeg",
        type: "script"
    }
}

saveBackpack(payload)