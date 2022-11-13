const CHAIN_STATE_SYSTEM = "nft:registeredNftsStateStore";
const CHAIN_STATE_ACCOUNT_PREFIX = "nft:registeredAccount:";
const CHAIN_STATE_NFT_PREFIX = "nft:registeredNFTToken:";
const CHAIN_STATE_TYPE_PREFIX = "nft:registeredNFTTypes";


 const typeSchema = {
    $id: "lisk/Histopia/nft/types",
    type: "object",
    required: ["id", "nftProperties", "name", "allowedAccessorTypes", "maxSupply"],

    properties: {
        id: {
            dataType: "uint32",
            fieldNumber: 1,
        },
        nftProperties: {
            type: "array",
            items: {
                type: "object",
                required: ["name", "minimum", "maximum"],
                properties: {
                    name: {
                        dataType: "string",
                        fieldNumber: 1,
                    },
                    minimum: {
                        dataType: "uint32",
                        fieldNumber: 2,
                    },
                    maximum: {
                        dataType: "uint32",
                        fieldNumber: 3,
                    }
                }
            },
            fieldNumber: 2,
        },
        name: {
            dataType: "string",
            fieldNumber: 3,
        },
        maxSupply: {
            dataType: "uint32",
            fieldNumber: 4,
        },
        allowedAccessorTypes: {
            dataType: "uint32",
            fieldNumber: 5,
        },
    }
}

const systemStateStoreSchema = {
    $id: "lisk/Histopia/nft/nftsStateStore",
    type: "object",
    required: ["registeredNFTsCount","mintFee","registeredTypesCount" , "ownerAddress"],
    properties: {
        registeredNFTsCount: {
            dataType: "uint32",
            fieldNumber: 1,
        },
        registeredTypesCount: {
            dataType: "uint32",
            fieldNumber: 2,
        },
        mintFee: {
            dataType: "uint64",
            fieldNumber: 3,
        },
        ownerAddress: {
            dataType: "bytes",
            fieldNumber: 4,
        }
    }
}

 const nftTokenSchema = {
    $id: "lisk/Histopia/nft/tokens",
    type: "object",
    required: ["id", "typeId", "ownerAddress", "nftProperties"],
    properties: {
        id: {
            dataType: "uint32",
            fieldNumber: 1,
        },
        typeId: {
            dataType: "uint32",
            fieldNumber: 2,
        },
        ownerAddress: {
            dataType: "bytes",
            fieldNumber: 3,
        },
        nftProperties: {
            type: "array",
            fieldNumber: 4,
            items: {
                type: "object",
                required: ["name", "amount"],
                properties: {
                    name: {
                        dataType: "string",
                        fieldNumber: 1,
                    },
                    amount: {
                        dataType: "uint32",
                        fieldNumber: 2,
                    }
                }
            }
        },
        locked: {
            dataType: "boolean",
            fieldNumber: 5,
        }
    }
}


const accountStateSchema = {
    $id: "lisk/Histopia/nft/accountState",
    type: "object",
    required: [],
    properties: {
        mintedNFTCount: {
            dataType: "uint32",
            fieldNumber: 1,
        },
        ownedNFTCount: {
            dataType: "uint32",
            fieldNumber: 2,
        },
        ownedNFTs: {
            type: "array",
            fieldNumber: 3,
            items: {
                dataType: "uint32",
            }
        }
    }
}


module.exports = {
    CHAIN_STATE_SYSTEM,
    nftTokenSchema,
    CHAIN_STATE_NFT_PREFIX,
    CHAIN_STATE_TYPE_PREFIX,
    typeSchema,
    systemStateStoreSchema,
    accountStateSchema,
    CHAIN_STATE_ACCOUNT_PREFIX,
};
