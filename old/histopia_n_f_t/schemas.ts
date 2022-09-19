// This key is used to save the data for the hello counter in the database
const CHAIN_STATE_NFT_TOKENS = "nft:registeredNFTTokens";
const CHAIN_STATE_NFT_TYPES = "nft:registeredNFTTypes";


const typesSchema = {
    $id: "lisk/Histopia/nft/types",
    type: "object",
    properties: {
        types: {
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


module.exports = {
    CHAIN_STATE_NFT_TOKENS,
    CHAIN_STATE_NFT_TYPES,
    typesSchema,
};
