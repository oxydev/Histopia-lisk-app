export const mintNFTSchema = {
    $id: 'histopianft/mintNFT-asset',
    title: 'MintNFTAsset transaction asset for histopianft module',
    type: 'object',
    required: [],
    properties: {
        to: {
            dataType: 'bytes',
            fieldNumber: 1,
        },
        typeId: {
            dataType: 'uint32',
            fieldNumber: 2,
        },
        count: {
            dataType: 'uint32',
            fieldNumber: 3,
        }
    },
};

export const addTypeSchema = {
    $id: 'histopianft/addType-asset',
    title: 'AddTypeAsset transaction asset for histopianft module',
    type: 'object',
    required: ["name", "maxSupply", "allowedAccessorTypes", "nftProperties"],
    properties: {
        name: {
            dataType: 'string',
            fieldNumber: 1,
        },
        maxSupply: {
            dataType: 'uint32',
            fieldNumber: 2,
        },
        allowedAccessorTypes: {
            dataType: 'uint32',
            fieldNumber: 3,
        },
        nftProperties: {
            type: 'array',
            fieldNumber: 4,
            items: {
                type: 'object',
                required: ['name', 'minimum', 'maximum'],
                properties: {
                    name: {
                        dataType: 'string',
                        fieldNumber: 1,
                    },
                    minimum: {
                        dataType: 'uint32',
                        fieldNumber: 2,
                    },
                    maximum: {
                        dataType: 'uint32',
                        fieldNumber: 3,
                    },
                }
            }
        },

    },
};

export const transferNFTSchema = {
    $id: 'histopianft/transfer-asset',
    title: 'TransferAsset transaction asset for histopianft module',
    type: 'object',
    required: [],
    properties: {
        to: {
            dataType: 'bytes',
            fieldNumber: 1,
        },
        nftId: {
            dataType: 'uint32',
            fieldNumber: 2,
        }
    },
};
export const destroyNFTSchema = {
    $id: 'histopianft/destroy-asset',
    title: 'DestroyAsset transaction asset for histopianft module',
    type: 'object',
    required: ['nftId'],
    properties: {
        nftId: {
            dataType: 'uint32',
            fieldNumber: 1,
        }
    },
};
