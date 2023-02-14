export const depositSchema = {
    $id: 'foe/deposit-asset',
    title: 'DepositAsset transaction asset for foe module',
    type: 'object',
    required: ['tokenIds'],
    properties: {
        tokenIds: {
            fieldNumber: 1,
            type: 'array',
            items: {
                dataType: 'uint32',
            }
        }
    },
};

export const harvestSchema = {
    $id: 'foe/harvest-asset',
    title: 'HarvestAsset transaction asset for foe module',
    type: 'object',
    required: [],
    properties: {},
};

export const withdrawSchema = {
    $id: 'foe/withdraw-asset',
    title: 'WithdrawAsset transaction asset for foe module',
    type: 'object',
    required: ['tokenIds'],
    properties: {
        tokenIds: {
            fieldNumber: 1,
            type: 'array',
            items: {
                dataType: 'uint32',
            }
        }
    },
};
