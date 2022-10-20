// This key is used to save the data for the hello counter in the database
const CHAIN_STATE_NFT_TOKEN = "nft:registeredNFTToken";
const CHAIN_STATE_NFT_TYPES = "nft:registeredNFTTypes";


const typesSchema = {
    $id: "lisk/Histopia/nft/types",
    type: "object",
    properties: {
        registeredTypes: {
            type: "array",
            fieldNumber: 1,
            items: {
                type: "object",
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
        }
    }
}

const nftTokenSchema = {
    $id: "lisk/Histopia/nft/tokens",
    type: "object",
    required: ["id", "typeId", "ownerAddress", "minPurchaseMargin", "value", "properties"],
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
        }
    }
}


module.exports = {
    CHAIN_STATE_NFT_TOKEN,
    CHAIN_STATE_NFT_TYPES,
    typesSchema,
    nftTokenSchema
};
