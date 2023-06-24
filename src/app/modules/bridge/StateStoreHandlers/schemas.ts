const CHAIN_STATE_BRIDGE = "bridge:bridgeSystemState";
const CHAIN_STATE_NULLS = "bridge:nulls";

const MerkleStateStoreSchema = {
    $id: "lisk/Histopia/bridge/bridgeSystemState",
    type: "object",
    required: [],
    properties: {
        zeros: {
            type: "array",
            fieldNumber: 1,
            items: {
                dataType: "bytes",
            }
        },
        filledSubtrees: {
            type: "array",
            fieldNumber: 2,
            items: {
                dataType: "bytes",
            }
        },
        currentRootIndex: {
            dataType: "uint32",
            fieldNumber: 3,
        },
        nextIndex: {
            dataType: "uint32",
            fieldNumber: 4,
        },
        roots: {
            type: "array",
            fieldNumber: 5,
            items: {
                dataType: "bytes",
            }
        }

    }
}

const BridgeSystemStateSchema = {
    $id: "lisk/Histopia/bridge/nulls",
    type: "object",
    required: [],
    properties: {
        nullifierHashes: {
            type: "array",
            fieldNumber: 1,
            items: {
                dataType: "bytes",
            }
        },

    }
}



module.exports = {
  CHAIN_STATE_BRIDGE,
    MerkleStateStoreSchema,
  BridgeSystemStateSchema,
  CHAIN_STATE_NULLS
};
