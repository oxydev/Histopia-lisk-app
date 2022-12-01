import {FOEState} from "./StateStoreHandlers/FOEStateHandler";
import {FOEAccountState} from "./StateStoreHandlers/FOEAccountHandler";
import {ReducerHandler} from "lisk-sdk";

function getMultiplier(lastRewardTime: number, timestamp: number) {
    return timestamp - lastRewardTime;
}

export function updatePool(foeState: FOEState, timestamp: number) : FOEState {
    if (timestamp <= foeState.lastRewardTime) {
        return foeState;
    }
    if (foeState.totalMilitaryPowerAtWar === 0) {
        foeState.lastRewardTime = timestamp;
        return foeState;
    }
    let multiplier = getMultiplier(foeState.lastRewardTime, timestamp);
    let eraReward = multiplier * foeState.eraPerSecond;
    foeState.generalAccEraPerShare += eraReward * 10**12 / foeState.totalMilitaryPowerAtWar;
    foeState.lastRewardTime = timestamp;
    return foeState;
}

export const  sendPreviousReward = async (userFoeAccountState: FOEAccountState, updatedFoeState: FOEState, reducerHandler: ReducerHandler, senderAddress: string)  => {
    if (userFoeAccountState.militaryPowerAtWar > 0) {
        let pending = (userFoeAccountState.militaryPowerAtWar * updatedFoeState.generalAccEraPerShare / 10 ** 12) - userFoeAccountState.rewardDebt;
        await reducerHandler.invoke('token:credit', {
            address: senderAddress,
            amount: pending,
        });
    }
}

export const calculateMilitaryPower = (nftData) => {
    let militaryPower = 0;
    for (const nftProperty of nftData.nftProperties) {
        militaryPower += nftProperty.amount;
    }
    return militaryPower;
}
