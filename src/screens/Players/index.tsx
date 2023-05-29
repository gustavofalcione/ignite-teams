import { useEffect, useState, useRef } from 'react'
import { Alert, FlatList, TextInput } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { addPlayerByGroup } from '@storage/players/addPlayerByGroup'
import { getPlayersByGroupAndTeam } from '@storage/players/getPlayerByGroupAndTeam'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@components/ButtonIcon'
import { Input } from '@components/Input'
import { Filter } from '@components/Filter'
import { PlayerCard } from '@components/PlayerCard'
import { EmptyList } from '@components/EmptyList'
import { Button } from '@components/Button'

import { AppError } from '@utils/AppError'

import { Container, Form, HeaderList, PlayersCounter } from './styles'
import { PlayerStorageDTO } from '@storage/players/PlayerStorageDTO'
import { removePlayerByGroup } from '@storage/players/removePlayerByGroup'
import { removeGroupByName } from '@storage/group/removeGroupByName'
import { Loading } from '@components/Loading'

interface RouteParams {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] = useState('Time A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const navigation = useNavigation()
  const route = useRoute()
  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer() {
    if (newPlayerName.trim().length <= 0) {
      return Alert.alert('Novo jogador', 'Informe o nome do novo jogador a ser adicionado')
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await addPlayerByGroup(newPlayer, group)
      setNewPlayerName('')
      fetchPlayerByTeam()

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo jogador', error.message)
      } else {
        console.log(error)
        Alert.alert('Novo jogador', 'Não foi possível adicionar novo jogador')
      }
    }

  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await removePlayerByGroup(playerName, group)
      fetchPlayerByTeam()

    } catch (error) {
      Alert.alert('Remover Jogador', 'Erro ao remover jogador')
    }
  }

  async function onRemoveGroup() {
    try {
      await removeGroupByName(group)
      navigation.navigate('groups')

    } catch (error) {
      Alert.alert('Remover grupo', 'Erro ao remover grupo')
    }
  }

  async function handleDeleteGroup() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => onRemoveGroup()},
      ]
    )
  }

  async function fetchPlayerByTeam() {
    try {
      setIsLoading(true)
      const playersByTeam = await getPlayersByGroupAndTeam(group, team)
      setPlayers(playersByTeam)

    } catch (error) {
      console.log(error)
      Alert.alert('Jogadores', 'Não foi possível carregar os jogadores')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayerByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />
      <Highlight 
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input 
          inputRef={newPlayerNameInputRef}
          placeholder="Nome do jogador" 
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList 
          data={['Time A',  'Time B']}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter 
              title={item} 
              isActive={item === team} 
              onPress={() => setTeam(item)}
            />
          )}
        />

        <PlayersCounter>
          {players.length}
        </PlayersCounter>
      </HeaderList>

      {
        isLoading 
        ? <Loading /> 
        : (
          <FlatList 
            data={players}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <PlayerCard 
                name={item.name} 
                onRemovePlayer={() => handleRemovePlayer(item.name)}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <EmptyList message="Não há jogadores nesse time" />
            )}
            contentContainerStyle={[
              { paddingBottom: 100 },
              players.length === 0 && { flex: 1 }
            ]}
          />
        )
      }

      <Button 
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleDeleteGroup}
      />

    </Container>
  )
}