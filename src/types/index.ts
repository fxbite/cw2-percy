export type RootStackParamList = {
    FromInput: undefined
    List: undefined
    Camera: undefined
}

export interface CurrentLocation {
    country: string | null
    city: string | null
    district: string | null
    region: string | null
    subregion: string | null
    street: string | null
}

export interface Photo {
    imageUrl: string
    gps?: CurrentLocation
} 