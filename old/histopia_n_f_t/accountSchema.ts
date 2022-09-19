export const accountSchema = {

    type: "object",
    required: ["ownNFTs"],
    properties: {
        ownNFTs: {
            type: "array",
            fieldNumber: 1,
            items: {
                dataType: "bytes",
            },
        },
    },
    default: {
        ownNFTs: [],
    },
}
