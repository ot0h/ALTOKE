import { JSX, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import FixyIcon from '@assets/FIXY.svg'
import { CustomButton } from '@components'
import CommunityCard from '../../components/CommunityCard'
import Comunidad from '@assets/patronato.png'
import CondominioCentral from '@assets/patronato.png'
import ReportCard from '../../components/ReportCard'
import JoinCommunityModal from '../modals/JoinCommunityModal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const Inicio = (): JSX.Element => {

  // POP UP
  const [joinModalVisible, setJoinModalVisible] = useState(false)
  const insets = useSafeAreaInsets()
  return (
    <ScrollView style={[styles.container, {paddingTop: insets.top}]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, Carlos! 👋</Text>
        <FixyIcon height={48} width={48} />
      </View>

      {/* Banner código */}
      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>Tienes un{'\n'}codigo?</Text>
        <View style={styles.codeRight}>
          <Text style={styles.codeSubtitle}>Unete al toke a tu comunidad</Text>
          <CustomButton
            variant="secondary"
            text={'CLICK AQUI'}
            onPress={() => setJoinModalVisible(true)}
          />
        </View>
      </View>

      {/* Mis Comunidades */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis Comunidades</Text>
        <Text style={styles.sectionLink}>Ver todas</Text>
      </View>

      <CommunityCard
        title={'Condominio Central'}
        description={'Hace 2 horas • Admin'}
        image={CondominioCentral}
        onPress={() => { }}
      />
      <CommunityCard
        title={'Patronato Los Castanos'}
        description={'Ayer • Comité'}
        image={Comunidad}
        onPress={() => { }}
      />

      {/* Reportes Recientes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reportes Recientes</Text>
      </View>

      <ReportCard
        title="Fuga de agua en área común"
        status={'revision'}
        report={'#RPT-0847'}
        category={'Fontanería'}
        onPress={() => { }}
      />
      <ReportCard
        title="Luminaria fundida pasillo 3"
        status={'resuelto'}
        report={'#RPT-0839'}
        category={'Electricidad'}
        onPress={() => { }}
      />
      <JoinCommunityModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
      />
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  codeCard: {
    borderWidth: 1.5,
    borderColor: '#3D5AFE',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  codeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    flexShrink: 1,
  },
  codeRight: {
    alignItems: 'flex-end',
    gap: 10,
    maxWidth: 160,
  },
  codeSubtitle: {
    fontSize: 12,
    color: '#3D5AFE',
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  sectionLink: {
    fontSize: 14,
    color: '#3D5AFE',
    fontWeight: '600',
  },
})
