import { StyleSheet, Text, View } from "react-native";


type StatusProps = {
    status?: "revision" | "resuelto" | "pendiente" | "proceso";
}

//Aqui a;adir los de mantenimiento despues  para reutilizar la etiqueta
const statusconfig ={
        revision:{
            label: "En Revision",
            backgroundColor: '#DBEAFE',
            color: "#3B82F6"
        },
       resuelto:{
            label: "Resuelto",
            backgroundColor: '#D1FAE5',
            color: "#10B981"
        },
        pendiente:{
            label: "Pendiente",
            backgroundColor: '#FEF3C7',
            color: "#F59E0B"
        },
        proceso:{
            label: "En Proceso",
            backgroundColor: '#BEC9EF',
            color: "#3E6CB0"
        },
        
    }

    export default function CustomLabel({status = 'pendiente'} :StatusProps){
        const config = statusconfig[status];
        
        return(
            <View style = {[styles.status,{backgroundColor: config.backgroundColor}]}>
                <Text style = {[styles.label, {color: config.color}]}>{config.label}</Text>
            </View>
        )
    }

    const styles = StyleSheet.create ({

            status:{
        height: 21,
        borderRadius: 100,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },

    label:{
        fontFamily:'Inter_700Bold',
        fontSize: 11,
        fontWeight: 'bold',
        paddingHorizontal: 8,

    }

    })
    