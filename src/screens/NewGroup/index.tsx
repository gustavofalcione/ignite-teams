import { createGroup } from '@storage/group/createGroup'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native' 

import { Header } from '@components/Header'
import { Container, Content, Icon } from './styles'
import { Input } from '@components/Input'
import { Highlight } from '@components/Highlight'
import { Button } from '@components/Button'
import { AppError } from '@utils/AppError'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function NewGroup() {
  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  async function handleCreateNewGroup() {
    try {
      if(group.trim().length === 0) {
       return Alert.alert('Novo Grupo', 'Informe o nome da turma')
      }

      await createGroup(group)
      navigation.navigate('players', { group })

    } catch(error) {
      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message)
      } else {
        Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo')
        console.log(error)
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <Highlight 
          title="Nova turma" 
          subtitle="cria a turma para adicionar as pessoas"
        />  

        <Input 
          placeholder="Nome da turma" 
          onChangeText={setGroup}
        />

        <Button 
          title="Criar" 
          style={{ marginTop: 20 }} 
          onPress={handleCreateNewGroup}
        />

      </Content>
    </Container>
  )
}