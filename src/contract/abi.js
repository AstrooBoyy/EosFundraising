export const ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "infoCid",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "collectedAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "needToCollect",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "author",
                "type": "address"
            }
        ],
        "name": "ProjectCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ProjectTipped",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "donateToProject",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "projectCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "projects",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "infoCid",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "collectedAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needToCollect",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "author",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_infoCid",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_needToCollect",
                "type": "uint256"
            }
        ],
        "name": "uploadProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]