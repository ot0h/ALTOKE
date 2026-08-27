import { Pressable, Text } from "react-native"

type Props = {
    title: string,
    status: "revision" | "resuelto" | "pendiente" | "proceso"
    report: string,
    category: string,
    time?: string,
    location? : string,
}

export default function ReportCard({title, status = "pendiente", report, category, time, location}: Props){

    return (
        <Pressable>
            <Text>{title}</Text>
            <Text>{status}</Text>
            <Text>{report}</Text>
            <Text>{category}</Text>
            <Text>{time}</Text>
            <Text>{location}</Text>
        </Pressable>
    )
} 