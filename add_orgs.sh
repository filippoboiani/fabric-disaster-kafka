
########################################################################
## This code is meant to add organizations to the disaster prototype. ##
########################################################################

# 1. INSIDE CONTAINER: download jq (convert protobuff to json)
echo '1. download jq (convert protobuff to json)'
apt update && apt install -y jq
echo

# 2. INSIDE CONTAINER: fetch the config block
echo '2. fetch the config block'
peer channel fetch config config_block.pb -o orderer.example.com:7050 -c mychannel --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo

# 3. INSIDE CONTAINER: convert the config block to json
echo '3. convert the config block to json'
configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config > config.json
echo 

# 4. OUTSIDE CONTAINER: generate the org specific config
echo '4. OUTSIDE CONTAINER: generate the org specific config'
cd artifacts/channel/
configtxgen -printOrg Org3MSP > ./org3.json
configtxgen -printOrg Org4MSP > ./org4.json
configtxgen -printOrg Org5MSP > ./org5.json
configtxgen -printOrg Org6MSP > ./org6.json

# 5. INSIDE CONTAINER: modify the config for all the orgs
echo '5. INSIDE CONTAINER: modify the config for all the orgs'
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org3MSP":.[1]}}}}}' config.json ./channel-artifacts/org3.json > modified_config.json
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org4MSP":.[1]}}}}}' config.json ./channel-artifacts/org4.json > modified_config.json
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org5MSP":.[1]}}}}}' config.json ./channel-artifacts/org5.json > modified_config.json
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org6MSP":.[1]}}}}}' config.json ./channel-artifacts/org6.json > modified_config.json

# 6. INSIDE CONTAINER: convert the config file back to protobuff
# first one
configtxlator proto_encode --input config.json --type common.Config --output config.pb

# then the modified one
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb

# compare the changes (delta)
configtxlator compute_update --channel_id mychannel --original config.pb --updated modified_config.pb --output orgAll_update.pb

# 7. decode the object into an editable json format
configtxlator proto_decode --input orgAll_update.pb --type common.ConfigUpdate | jq . > orgAll_update.json

# 8. wrap it in an envelope message 
echo '{"payload":{"header":{"channel_header":{"channel_id":"mychannel", "type":2}},"data":{"config_update":'$(cat orgAll_update.json)'}}}' | jq . > orgAll_update_in_envelope.json

# 9. convert it to protobuf 
configtxlator proto_encode --input orgAll_update_in_envelope.json --type common.Envelope --output orgAll_update_in_envelope.pb

# 10. sign it all!
peer channel signconfigtx -f orgAll_update_in_envelope.pb

# 11. swritch the cli container to reflect the org2 admin (or someone that is already enrolled)
# this is necessary to sign
# export CORE_PEER_LOCALMSPID="Org2MSP"
# export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
# export CORE_PEER_ADDRESS=peer0.org2.example.com:7051

# 12. finally update the channel
peer channel update -f orgAll_update_in_envelope.pb -c mychannel -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem
