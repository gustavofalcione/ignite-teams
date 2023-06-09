import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppError } from '@utils/AppError';

import { PLAYER_COLLECTION } from '@storage/storageConfig'; 

import { PlayerStorageDTO } from './PlayerStorageDTO';
import { getPlayersByGroup } from './getPlayersByGroup';

export async function addPlayerByGroup(newPlayer: PlayerStorageDTO, group: string){
  try {
    const storedPlayers = await getPlayersByGroup(group)

    const playerAlreadyAdd = storedPlayers.filter(player => player.name === newPlayer.name)

    if (playerAlreadyAdd.length > 0) {
      throw new AppError('Essa pessoa já está adicionada em um outro time')
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)

  } catch (error) {
    throw error
  }
}