const CHAIN_STATE_FOE = "foe:foeSystemState";
const CHAIN_STATE_ACCOUNT_FOE_PREFIX = "foe:AccountFoeState:";


const FOEStateStoreSchema = {
    $id: "lisk/Histopia/foe/foeSystemState",
    type: "object",
    required: ["totalMilitaryPowerAtWar","eraPerSecond","lastRewardTime" , "generalAccEraPerShare"],
    properties: {
        totalMilitaryPowerAtWar: {
            dataType: "uint64",
            fieldNumber: 1,
        },
        eraPerSecond: {
            dataType: "uint64",
            fieldNumber: 2,
        },
        lastRewardTime: {
            dataType: "uint64",
            fieldNumber: 3,
        },
        histopianCount: {
            dataType: "uint64",
            fieldNumber: 4,
        },
        generalAccEraPerShare: {
            dataType: "uint64",
            fieldNumber: 5,
        }
    }
}


const FOEAccountStateSchema = {
    $id: "lisk/Histopia/foe/foeAccountState",
    type: "object",
    required: [],
    properties: {
        militaryPowerAtWar: {
            dataType: "uint64",
            fieldNumber: 1,
        },
        rewardDebt: {
            dataType: "uint64",
            fieldNumber: 2,
        }
    }
}


module.exports = {
    CHAIN_STATE_FOE,
    FOEStateStoreSchema,
    CHAIN_STATE_ACCOUNT_FOE_PREFIX,
    FOEAccountStateSchema
};
