import { View, Text, StyleSheet, ScrollView } from "react-native"
import CommunityCard from "../components/CommunityCard"
import Patronato from "@assets/patronato.png"
import { SafeAreaView } from "react-native-safe-area-context"


export const MyCommunity = () => {

    return(
        <SafeAreaView style = {styles.safearea}>
        <ScrollView>
        <View style = {styles.container}>
            <View>
            <Text style = {styles.title}>Mis Comunidades</Text>
            </View>

                <View style = {styles.cards}>
                <CommunityCard 
                title="Patronato"
                image={Patronato}
                onPress={()=>{}}
                description="Patronato Vecinal"
                variant="extended"
                />
                
                </View>
                
        </View>
        </ScrollView>
        </SafeAreaView>
        

    )

}

const styles =  StyleSheet.create({

    safearea:{
        flex:1,
        alignContent: 'center',
        alignItems: 'center'
        },

    container:{
        marginTop:52,
        gap: 52.5,
        width: 362
        
    },
    title:{
        fontFamily: 'MontserratAlternates_700Bold_Italic',
        fontWeight: 'bold',
        fontSize: 22

    },
    cards:{
        width: '100%',
        gap:16,
    },



})