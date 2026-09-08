import { JSX } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
} from 'react-native'

import NoticiaImage from '@assets/noticia.svg'
import FIXYICON from '@assets/FIXYLOGIN.svg'

import { MaterialIcons, Octicons } from '@expo/vector-icons'

export const Noticia = (): JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.backButton}>
            <MaterialIcons size={25} name="arrow-back" color="#64748B" />
          </Pressable>

          <Text style={styles.headerTitle}>Noticia</Text>
        </View>

        {/* IMAGEN */}
        <View style={styles.imageContainer}>
          <NoticiaImage
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </View>

        {/* CONTENIDO */}
        <View style={styles.content}>
          {/* TITULO */}
          <Text style={styles.title}>Gran reunión de vecinos este Domingo</Text>

          {/* AUTOR */}
          <View style={styles.authorSection}>
            <View style={styles.authorRow}>
              <FIXYICON width={34} height={34} />

              <View style={styles.authorInfo}>
                <Text style={styles.textAuthor}>Administración Al Toke</Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.textDetails}>Publicado el 12 Oct</Text>

                  <Octicons name="dot-fill" size={8} color="#64748B" />

                  <Text style={styles.textDetails}>Lectura: 3 min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* LINEA */}
          <View style={styles.divider} />

          {/* DESCRIPCION */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.fontDescription}>
              Estimados residentes de Los Pinos, los invitamos cordialmente a
              participar en nuestra asamblea general de vecinos que se llevará a
              cabo este domingo en el salón de eventos comunal. Su presencia y
              voz son fundamentales para el desarrollo de nuestro condominio.
            </Text>

            <Text style={styles.fontDescription}>
              Durante la asamblea trataremos temas de vital importancia, tales
              como el presupuesto del próximo ciclo, las mejoras en el sistema
              de acceso vehicular mediante códigos QR y el cronograma de
              mantenimiento general de áreas verdes.
            </Text>

            <Text style={styles.fontDescription}>
              Agradecemos de antemano su puntual asistencia. Al finalizar la
              reunión tendremos un espacio para resolver dudas y escuchar sus
              sugerencias.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    alignContent: 'center',
    alignItems: 'center',
  },

  scrollContent: { paddingBottom: 100 },

  /* HEADER */

  header: {
    height: 176,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FC',
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EDF3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontFamily: 'MontserratAlternates_700Bold',
    fontSize: 24,
    color: '#34405A',
  },

  /* IMAGEN */

  imageContainer: {
    width: '100%',
    height: 222,
    overflow: 'hidden',
  },

  /* CONTENIDO */

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  title: {
    fontFamily: 'MontserratAlternates_700Bold',
    fontSize: 23,
    lineHeight: 28,
    color: '#34405A',
    marginBottom: 14,
  },

  /* AUTOR */

  authorSection: {
    marginBottom: 12,
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  authorInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  textAuthor: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#34405A',
    marginBottom: 2,
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  textDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#64748B',
  },

  /* DIVISOR */

  divider: {
    height: 1,
    backgroundColor: '#D9DEE7',
    width: '100%',
    marginBottom: 12,
  },

  /* DESCRIPCION */

  descriptionContainer: {
    gap: 14,
  },

  fontDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
  },
})
