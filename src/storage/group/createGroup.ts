import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppError } from '@utils/AppError';
import { GROUP_COLLECTION } from '@storage/storageConfig'
import { getAllGroups } from './getAllGroups'

export async function createGroup(newGroupName: string) {
  try {
    const storedGroups = await getAllGroups()
    
    const groupNameAlreadyInUse = storedGroups.includes(newGroupName);

    if(groupNameAlreadyInUse) {
      throw new AppError('Esse nome de grupo já está em uso')
    }

    const storage = JSON.stringify([...storedGroups, newGroupName])

    await AsyncStorage.setItem(GROUP_COLLECTION, storage)

  } catch (error) {
    throw error
  }
}