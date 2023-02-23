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
    if (foeState.totalEraDistributed === undefined) {
        foeState.totalEraDistributed = BigInt(0);
    }
    if (foeState.totalMilitaryPowerAtWar === 0) {
        foeState.lastRewardTime = Number(timestamp);
        return foeState;
    }
    let multiplier = getMultiplier(foeState.lastRewardTime, timestamp);
    let eraReward = BigInt(multiplier * foeState.eraPerSecond);
    foeState.generalAccEraPerShare += BigInt(eraReward * BigInt(10**5) / BigInt(foeState.totalMilitaryPowerAtWar));
    foeState.lastRewardTime = Number(timestamp);
    foeState.totalEraDistributed += BigInt(eraReward);
    return foeState;
}

export const  sendPreviousReward = async (userFoeAccountState: FOEAccountState, updatedFoeState: FOEState, reducerHandler: ReducerHandler, senderAddressBuffer: Buffer)  => {
    if (userFoeAccountState.totalEraEarned === undefined) {
        userFoeAccountState.totalEraEarned = BigInt(0);
    }
    if (userFoeAccountState.militaryPowerAtWar > 0) {
        let f1 = BigInt(userFoeAccountState.militaryPowerAtWar)
        let f2 = BigInt(updatedFoeState.generalAccEraPerShare);
        let s1 = f1 * f2;

        let s2 = BigInt(s1 / BigInt(10 ** 5));

        let pending = s2 - BigInt(userFoeAccountState.rewardDebt);


        await reducerHandler.invoke('token:credit', {
            address: senderAddressBuffer,
            amount: BigInt(pending),
        });

        userFoeAccountState.totalEraEarned += BigInt(pending);
    }
}


export const  calculatePendingEra = async (userFoeAccountState: FOEAccountState, updatedFoeState: FOEState, timestamp: number)  => {
    if (userFoeAccountState.militaryPowerAtWar > 0) {
        
        if (timestamp <= updatedFoeState.lastRewardTime) {
            return 0;
        }
        if (updatedFoeState.totalMilitaryPowerAtWar === 0) {
            return 0;
        }
        console.log("updatedFoeState1");
        try {
            let multiplier = getMultiplier(updatedFoeState.lastRewardTime, timestamp);

            let eraReward = multiplier * updatedFoeState.eraPerSecond;

            updatedFoeState.generalAccEraPerShare = BigInt(updatedFoeState.generalAccEraPerShare) + BigInt((BigInt(eraReward) * BigInt(10**5)) / BigInt(updatedFoeState.totalMilitaryPowerAtWar));

            let f1 = BigInt(userFoeAccountState.militaryPowerAtWar)
            let f2 = BigInt(updatedFoeState.generalAccEraPerShare);
            let s1 = f1 * f2;

            let s2 = BigInt(s1 / BigInt(10 ** 5));

            let pending = s2 - BigInt(userFoeAccountState.rewardDebt);

            if (pending < 0) {
                pending = BigInt(0);
            }

            return pending;
        } catch (error) {
            console.log("error", error);
            return 0;
        }
    }
    return 0;
}


export const calculateMilitaryPower = (nftData) => {
    let militaryPower = 0;
    for (const nftProperty of nftData.nftProperties) {
        militaryPower += nftProperty.amount;
    }
    return militaryPower;
}
