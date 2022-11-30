export type TypeProperty = {
    name: string;
    minimum: number;
    maximum: number;
}

export type NFTProperty = {
    name: string;
    amount: number;
}

export type TypeStorageData = {
    id: string;
    typeProperties: TypeProperty[];
    name: string;
    maxSupply: number;
    allowedAccessorTypes: number[];
}

export type NFTStorageData = {
    id: number;
    typeId: number;
    ownerAddress: Buffer;
    nftProperties: NFTProperty[];
    locked: boolean;
}


