

export interface Iadvancedsearch {
   query: {
    color?: string
    size?: string
    fileFormat?: string
    style?: string
    licenseType?: string
    dateAdded?: string
    popularity?: string
    author?: string
    tags?: [string]
   },
    options: {
        limit: number 
        page: number
    }
}