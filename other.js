"org1": {
  "name": "peerOrg1",
  "mspid": "Org1MSP",
  "user": {
    "key": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/4d9fb86f037730984c44804b2b5ad12dd11c73e50ba36c4bdd2e766c99352aa3_sk",
    "cert": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
  },
  "ca": {
    "url": "https://9.134.210.66:7054",
    "name": "ca-org1"
  },
  "peer1": {
    "requests": "grpcs://9.134.210.66:7051",
    "events": "grpcs://9.134.210.66:7053",
    "server-hostname": "peer0.org1.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  },
  "peer2": {
    "requests": "grpcs://9.134.210.66:7056",
    "events": "grpcs://9.134.210.66:7058",
    "server-hostname": "peer1.org1.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt"
  }
},
"org2": {
  "name": "peerOrg2",
  "mspid": "Org2MSP",
  "user": {
    "key": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/1b9f2faccb94c5e7a1cf706d955ed5e1d583c41735908a0bb9cca93b7b2b5583_sk",
    "cert": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem"
  },
  "ca": {
    "url": "https://9.134.207.59:8054",
    "name": "ca-org2"
  },
  "peer1": {
    "requests": "grpcs://9.134.207.59:8051",
    "events": "grpcs://9.134.207.59:8053",
    "server-hostname": "peer0.org2.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
  },
  "peer2": {
    "requests": "grpcs://9.134.207.59:8056",
    "events": "grpcs://9.134.207.59:8058",
    "server-hostname": "peer1.org2.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt"
  }
},
"org3": {
  "name": "peerOrg3",
  "mspid": "Org3MSP",
  "user": {
    "key": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/keystore/b2beb754750bb52ad79b8d7782d7ed01e611b0380ea71fc5b1096d903d0d0f9b_sk",
    "cert": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp/signcerts/Admin@org3.example.com-cert.pem"
  },
  "ca": {
    "url": "https://9.134.210.66:9054",
    "name": "ca-org3"
  },
  "peer1": {
    "requests": "grpcs://9.134.210.66:9051",
    "events": "grpcs://9.134.210.66:9053",
    "server-hostname": "peer0.org3.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"
  },
  "peer2": {
    "requests": "grpcs://9.134.210.66:9056",
    "events": "grpcs://9.134.210.66:9058",
    "server-hostname": "peer1.org3.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org3.example.com/peers/peer1.org3.example.com/tls/ca.crt"
  }
},
"org4": {
  "name": "peerOrg4",
  "user": {
    "key": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/keystore/677d9d72f96a2ffa4411286f4fde1d8f0c865208e296b1bd23959e63b9c6e9c5_sk",
    "cert": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org4.example.com/users/Admin@org4.example.com/msp/signcerts/Admin@org4.example.com-cert.pem"
  },
  "mspid": "Org4MSP",
  "ca": {
    "url": "https://9.134.207.59:10054",
    "name": "ca-org4"
  },
  "peer1": {
    "requests": "grpcs://9.134.207.59:10051",
    "events": "grpcs://9.134.207.59:10053",
    "server-hostname": "peer0.org4.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt"
  },
  "peer2": {
    "requests": "grpcs://9.134.207.59:10056",
    "events": "grpcs://9.134.207.59:10058",
    "server-hostname": "peer1.org4.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org4.example.com/peers/peer1.org4.example.com/tls/ca.crt"
  }
},
"org5": {
  "name": "peerOrg5",
  "mspid": "Org5MSP",
  "user": {
    "key": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org5.example.com/users/Admin@org5.example.com/msp/keystore/090283183ae2e02bbe4045b07f23461f4658e87aacdd0b7fb4d50ef02d991e95_sk",
    "cert": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org5.example.com/users/Admin@org5.example.com/msp/signcerts/Admin@org5.example.com-cert.pem"
  },
  "ca": {
    "url": "https://9.134.210.66:11054",
    "name": "ca-org5"
  },
  "peer1": {
    "requests": "grpcs://9.134.210.66:11051",
    "events": "grpcs://9.134.210.66:11053",
    "server-hostname": "peer0.org5.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt"
  },
  "peer2": {
    "requests": "grpcs://9.134.210.66:11056",
    "events": "grpcs://9.134.210.66:11058",
    "server-hostname": "peer1.org5.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org5.example.com/peers/peer1.org5.example.com/tls/ca.crt"
  }
},
"org6": {
  "name": "peerOrg6",
  "mspid": "Org6MSP",
  "user": {
    "key": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org6.example.com/users/Admin@org6.example.com/msp/keystore/7594f560eb33627ee388bf601d59f46f4f50051109c9345ed311c8b219ae291a_sk",
    "cert": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org6.example.com/users/Admin@org6.example.com/msp/signcerts/Admin@org6.example.com-cert.pem"
  },
  "ca": {
    "url": "https://9.134.207.59:12054",
    "name": "ca-org6"
  },
  "peer1": {
    "requests": "grpcs://9.134.207.59:12051",
    "events": "grpcs://9.134.207.59:12053",
    "server-hostname": "peer0.org6.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org6.example.com/peers/peer0.org6.example.com/tls/ca.crt"
  },
  "peer2": {
    "requests": "grpcs://9.134.207.59:12056",
    "events": "grpcs://9.134.207.59:12058",
    "server-hostname": "peer1.org6.example.com",
    "tls_cacerts": "network/fabric-v11/prototype/channel/crypto-config/peerOrganizations/org6.example.com/peers/peer1.org6.example.com/tls/ca.crt"
  }
}