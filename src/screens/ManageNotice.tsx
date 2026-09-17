import { JSX, useMemo } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { CustomButton } from '@components'
import ManageNoticeCard from '../components/ManageNoticeCard'
import Patronato from '@assets/patronato.png'
import { ThemeColors, useTheme } from '@contexts/ThemeContext'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { removeNews } from '../store/slices/newsSlice'
import { RootStackParamList } from '../navigation/StackNavigator'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ManageNotice'
>

export const ManageNotices = ({ route, navigation }: Props): JSX.Element => {
  const { communityId } = route.params

  const { colors } = useTheme()
  const styles = createStyles(colors)
  const insets = useSafeAreaInsets()

  const dispatch = useAppDispatch()

  const allNews = useAppSelector(
    (state) => state.news.news,
  )

  const news = useMemo(
    () =>
      allNews.filter(
        (notice) => notice.communityId === communityId,
      ),
    [allNews, communityId],
  )

  const handleDelete = (id: string) => {
    dispatch(removeNews(id))
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gestión noticias</Text>

        <View style={styles.createButton}>
          <CustomButton
            text="+  Crear"
            variant="secondary"
            onPress={() => {navigation.navigate('NuevaNoticia',  {communityId})}}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {news.map((notice) => (
          <ManageNoticeCard
            key={notice.id}
            title={notice.title}
            time={notice.createdAt}
            status="publicada"
            image={
              notice.image
                ? { uri: notice.image }
                : Patronato
            }
            onEdit={() => {
              console.log('Editar', notice.id)
            }}
            onDelete={() => {
              handleDelete(notice.id)
            }}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 9,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 28,
      color: colors.text,
    },

    createButton: {
      width: 115,
    },

    list: {
      gap: 16,
      paddingBottom: 20,
    },
  })