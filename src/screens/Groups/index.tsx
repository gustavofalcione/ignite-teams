import { useState, useCallback } from 'react'
import { Alert, FlatList } from 'react-native'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { GroupCard } from '@components/GroupCard'
import { EmptyList } from '@components/EmptyList'
import { Button } from '@components/Button'

import { Container } from './styles'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { getAllGroups } from '@storage/group/getAllGroups'
import { Loading } from '@components/Loading'

export function Groups() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])

  const navigation = useNavigation()

  function handleCreateNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      setIsLoading(true)
      const data = await getAllGroups()
      setGroups(data)

    } catch(error) {
      console.log(error)
      Alert.alert('Turmas', 'Não foi possível carregas as turmas')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  useFocusEffect(useCallback(() => {
    fetchGroups()
  }, []))

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="jogue com a sua turma" />

      {
        isLoading 
        ? <Loading />
        : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <GroupCard title={item} onPress={() => handleOpenGroup(item)} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <EmptyList message="Que tal cadastrar a primeira turma?" />
            )}
          />
        )
      }

      <Button 
        title="Criar nova turma" 
        onPress={handleCreateNewGroup}
      />
    </Container>
  );
}
