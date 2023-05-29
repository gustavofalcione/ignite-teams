import { ButtonIcon } from '@components/ButtonIcon';
import { Container, Name, Icon } from './styles'

interface PlayerCardProps {
  name: string;
  onRemovePlayer: () => void;
}

export function PlayerCard({ name, onRemovePlayer }: PlayerCardProps) { 
  return (
    <Container>
      <Icon name="person" />

      <Name>
        {name}
      </Name>

      <ButtonIcon 
        icon="close" 
        type="SECONDARY" 
        onPress={onRemovePlayer}
      />
    </Container>
  )
}