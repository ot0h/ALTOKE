import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ReportStatus =
    | 'revision'
    | 'pendiente'
    | 'proceso'
    | 'resuelto'

type Report = {
    id: string
    title: string
    description: string
    category: string
    location: string
    status: ReportStatus
    userId: string
    communityId: string
    createdAt: string
}

type ReportsState = {
    reports: Report[]
    selectedReport: Report | null
    loading: boolean
}

const initialState: ReportsState = {
    reports: [],
    selectedReport: null,
    loading: false,
}

const reportsSlice = createSlice({
    name: 'reports',
    initialState,

    reducers: {
        setReports: (
            state,
            action: PayloadAction<Report[]>
        ) => {
            state.reports = action.payload
        },

        addReport: (
            state,
            action: PayloadAction<Report>
        ) => {
            state.reports.push(action.payload)
        },

        setSelectedReport: (
            state,
            action: PayloadAction<Report>
        ) => {
            state.selectedReport = action.payload
        },

        updateReportStatus: (
            state,
            action: PayloadAction<{
                id: string
                status: ReportStatus
            }>
        ) => {
            const report = state.reports.find(
                report => report.id === action.payload.id
            )

            if (report) {
                report.status = action.payload.status
            }
        },

        removeReport: (
            state,
            action: PayloadAction<string>
        ) => {
            state.reports = state.reports.filter(
                report => report.id !== action.payload
            )
        },
    },
});

export const{
    setReports,
    removeReport,
    updateReportStatus,
    addReport,
    setSelectedReport,   
} = reportsSlice.actions

export default reportsSlice.reducer