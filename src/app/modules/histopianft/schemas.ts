// This key is used to save the data for the hello counter in the database
 const CHAIN_STATE_NFTS = "nft:registeredNftsStateStore";
 const CHAIN_STATE_NFT_PREFIX = "nft:registeredNFTToken";
 const CHAIN_STATE_TYPE_PREFIX = "nft:registeredNFTTypes";
 const CHAIN_STATE_TYPES = "nft:typesStateStore";


 const typesStateStoreSchema = {
    $id: "lisk/Histopia/nft/typesStateStore",
    type: "object",
    required: ["registeredTypesCount"],
    properties: {
        registeredTypesCount: {
            dataType: "uint32",
            fieldNumber: 1,
        }
    }
}

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
        }
    }
}

const nftsStateStoreSchema = {
    $id: "lisk/Histopia/nft/nftsStateStore",
    type: "object",
    required: ["registeredNFTsCount"],
    properties: {
        registeredNFTsCount: {
            dataType: "uint32",
            fieldNumber: 1,
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

module.exports = {
    typesStateStoreSchema,
    CHAIN_STATE_TYPES,
    nftTokenSchema,
    CHAIN_STATE_NFTS,
    CHAIN_STATE_NFT_PREFIX,
    CHAIN_STATE_TYPE_PREFIX,
    typeSchema,
    nftsStateStoreSchema
};
