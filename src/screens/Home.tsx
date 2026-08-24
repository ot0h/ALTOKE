import { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconFixy from '@assets/ICON FIXY.svg'
import Wave from '@assets/wave_home.svg'
import { CustomButton } from '@components'

export const Home = (): JSX.Element => {
  return (
    <View style={styles.container}>
      {/* START */}
      <View style={styles.start}>
        <IconFixy width={130} height={118} />
        <Text
          style={[
            styles.textFont,
            {
              color: '#1E2744',
              fontSize: 24,
              fontWeight: 600,
            },
          ]}
        >
          Gestiona tu comunidad
        </Text>
        <Text
          style={[
            styles.textFont,
            {
              color: '#3E6CB0',
              fontSize: 16,
              fontWeight: 600,
            },
          ]}
        >
          Reporta. Comunica. Resuelva al Toke.
        </Text>
      </View>

      {/* END */}
      <View style={styles.end}>
        <Text
          style={[
            styles.textFont,
            {
              color: '#1E2744',
              fontSize: 15,
              fontWeight: 600,
            },
          ]}
        >
          Tu comunidad a un toque de distancia:
        </Text>

        <View style={styles.botones}>
          <CustomButton
            text="Crear Cuenta"
            variant="primary"
            onPress={() => console.log('Crear cuenta')}
          />
          <CustomButton
            text="Iniciar Sesion"
            variant="default"
            onPress={() => console.log('Crear cuenta')}
          />
        </View>
      </View>
      <Wave width={'100%'} height={'25%'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 0,
    alignItems: 'center',
    gap: 20,
  },

  textFont: {
    fontFamily: 'MontserratAlternates_600SemiBold',
  },

  start: {
    paddingTop: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },

  end: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },

  botones: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
})
