package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

/*
// Saved commands for testing
peer chaincode install -p chaincodedev/chaincode/prototype/go -n mycc -v 0
peer chaincode instantiate -n mycc -v 0 -c '{"Args":[""]}' -C myc
peer chaincode invoke -n mycc -c '{"Args":["initLedger"]}' -C myc
peer chaincode invoke -n mycc -c '{"Args":["getHistoryForRecord", "123456-7890"]}' -C myc
peer chaincode invoke -n mycc -c '{"Args":["deleteMedicalRecord", "940220-0050"]}' -C myc
peer chaincode invoke -n mycc -c '{"Args":["createMedicalRecord", "940220-0050", "Okan", "Arabaci", "male", "Kista", "Farsan"]}' -C myc
peer chaincode invoke -n mycc -c '{"Args":["createMedicalRecord", "940220-0050", "Okan", "Arabaci", "male", "Kista", "Farsan"]}' -C myc
peer chaincode query -n mycc -c '{"Args":["getMedicalRecord","MedicalRecord3"]}' -C myc
peer chaincode query -n mycc -c '{"Args":["getMedicalRecord","940220-0050"]}' -C myc
peer chaincode query -n mycc -c '{"Args":["getMedicalRecord","940220-0050"]}' -C
peer chaincode invoke -n mycc -c '{"Args":["queryAllRecords"]}' -C myc
*/

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

// MedicalRecord implements a simple chaincode to manage an asset
type MedicalRecord struct {
	PersonalNumber string   `json:"personal_number"`
	Firstname      string   `json:"firstname"`
	Lastname       string   `json:"lastname"`
	Gender         string   `json:"gender"`
	Address        string   `json:"address"`
	ContactPerson  string   `json:"contact_person"`
	Caregivers     []string `json:"caregivers"`
	Allergies      []string `json:"allergies"`
	Places         []string `json:"places"`
	ClinicalInfo   []string `json:"clinicalinfo"`
}

// MedicalRecords implements a simple chaincode to manage an asset
type MedicalRecords struct {
	MedicalRecords []MedicalRecord `json:"medicalrecords"`
}

// Init is called during chaincode instantiation to initialize any
// data. Note that chaincode upgrade also calls this function to reset
// or to migrate data.
func (t *MedicalRecord) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke is called per transaction on the chaincode.
func (t *MedicalRecord) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	// Extract the function and args from the transaction proposal
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	var err error

	// Route to the appropriate handler function to interact with the ledger
	if function == "getMedicalRecord" {
		return t.getMedicalRecord(stub, args)
	} else if function == "createMedicalRecord" {
		return t.createMedicalRecord(stub, args)
	} else if function == "initLedger" {
		return t.initLedger(stub)
	} else if function == "deleteMedicalRecord" {
		return t.deleteMedicalRecord(stub, args)
	} else if function == "getHistoryForRecord" {
		return t.getHistoryForRecord(stub, args)
	} else if function == "queryAllRecords" {
		return t.queryAllRecords(stub)
	}

	if err != nil {
		return shim.Error(err.Error())
	}

	// Return the result as success payload
	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// Retrieve medical record of person with personal number as identifier
func (t *MedicalRecord) getMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var personalNumber string // Entity
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting personal number of the person to query")
	}

	personalNumber = args[0]

	// Get the state from the ledger
	medicalRecord, err := stub.GetState(personalNumber)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + personalNumber + "\"}"
		return shim.Error(jsonResp)
	}

	if medicalRecord == nil {
		jsonResp := "{\"Error\":\"No medical record with personal number " + personalNumber + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"Personal number\":\"" + personalNumber + "\",\"Medical Record\":\"" + string(medicalRecord) + "\"}"
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(medicalRecord)
}

// Creates medical record with minimum args listed below
func (t *MedicalRecord) createMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	// Must have: 0) PersonalNumber, 1) Firstname, 2) Lastname, 3) Gender, 4) Address, 5) Contactperson
	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}
	fmt.Println("Arg0:" + args[0])
	fmt.Println("Arg1:" + args[1])
	fmt.Println("Arg2:" + args[2])
	fmt.Println("Arg3:" + args[3])
	fmt.Println("Arg4:" + args[4])
	fmt.Println("Arg5:" + args[5])

	// Set args for the created record
	var medicalRecord = MedicalRecord{PersonalNumber: args[0], Firstname: args[1], Lastname: args[2], Gender: args[3], Address: args[4], ContactPerson: args[5]}
	medicalRecordAsBytes, _ := json.Marshal(medicalRecord)
	stub.PutState(args[0], medicalRecordAsBytes)

	return shim.Success(nil)

}

// Delete medical record based on ID
func (t *MedicalRecord) deleteMedicalRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	A := args[0]

	// Delete the key from the state in ledger
	err := stub.DelState(A)
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

// Gets history of values for the medical record
func (t *MedicalRecord) getHistoryForRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	medicalRecord := args[0]

	fmt.Printf("- start getHistoryForRecord: %s\n", medicalRecord)

	resultsIterator, err := stub.GetHistoryForKey(medicalRecord)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForRecord returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())

}

// Initate ledger with sample data
func (t *MedicalRecord) initLedger(stub shim.ChaincodeStubInterface) pb.Response {
	medicalRecords := []MedicalRecord{
		MedicalRecord{PersonalNumber: "000000-0001", Firstname: "Cecile", Lastname: "Graves", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0002", Firstname: "Vinson", Lastname: "Browning", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0003", Firstname: "Susan", Lastname: "Hickman", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0004", Firstname: "Lula", Lastname: "Merrill", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0005", Firstname: "Shari", Lastname: "Mcintyre", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0006", Firstname: "Campbell", Lastname: "Ball", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0007", Firstname: "Lindsay", Lastname: "Knapp", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0008", Firstname: "Cruz", Lastname: "Berg", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0009", Firstname: "Griffith", Lastname: "Lloyd", Gender: "male", Address: "Teststreet 1", ContactPerson: "Family"},
		MedicalRecord{PersonalNumber: "000000-0000", Firstname: "Candace", Lastname: "Oconnor", Gender: "female", Address: "Teststreet 1", ContactPerson: "Family"},
	}

	i := 0
	for i < len(medicalRecords) {
		recordAsBytes, _ := json.Marshal(medicalRecords[i])
		stub.PutState(medicalRecords[i].PersonalNumber, recordAsBytes)
		fmt.Println("Added", medicalRecords[i])
		i = i + 1
	}

	return shim.Success(nil)
}

// Query function dsakdposa
func (t *MedicalRecord) queryAllRecords(stub shim.ChaincodeStubInterface) pb.Response {

	startKey := "000000-0000"
	endKey := "999999-9999"

	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllRecords:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Medical Record
	err := shim.Start(new(MedicalRecord))
	if err != nil {
		fmt.Printf("Error creating new Simple Asset: %s", err)
	}
}
