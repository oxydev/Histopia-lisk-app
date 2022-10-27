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
        }
    },
};
